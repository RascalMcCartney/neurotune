import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { FileValidationResult, UploadResult, StorageService } from '../types/storage';
import { logInfo, logWarn, logError, logDebug } from './logger';

// Allowed audio file types
const ALLOWED_AUDIO_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/flac': ['.flac'],
  'audio/aac': ['.aac'],
  'audio/ogg': ['.ogg'],
  'audio/mp4': ['.m4a']
} as const;

export const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];

export class AzureStorageService implements StorageService {
  private containerClient: ContainerClient | null = null;
  private accountName: string;
  private containerName: string;
  private sasToken: string;

  constructor(accountName?: string, containerName?: string, sasToken?: string) {
    // Use provided parameters or fall back to environment variables
    this.accountName = accountName || import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || 'neurotunetrackstorage';
    this.containerName = containerName || import.meta.env.VITE_AZURE_CONTAINER_NAME || 'songs';
    this.sasToken = sasToken || import.meta.env.VITE_AZURE_SAS_TOKEN || 'sp=racwdli&st=2025-09-26T12:04:45Z&se=2030-09-26T20:19:45Z&sip=82.132.216.101&spr=https&sv=2024-11-04&sr=c&sig=dNPZ%2BOACTko9f3l06DmAaDXN0mcg1tR7h5gkfBXgR54%3D';

    logInfo(`Initializing Azure Storage Service`, {
      accountName: this.accountName,
      containerName: this.containerName,
      sasTokenLength: this.sasToken.length
    }, 'AzureStorage');

    this.initializeClient();
  }

  /**
   * Initializes the Azure Blob Storage client with SAS token
   */
  private initializeClient(): void {
    try {
      const blobServiceUrl = `https://${this.accountName}.blob.core.windows.net?${this.sasToken}`;
      const blobServiceClient = new BlobServiceClient(blobServiceUrl);
      this.containerClient = blobServiceClient.getContainerClient(this.containerName);
      logInfo('Azure Blob Storage client initialized successfully', {
        accountName: this.accountName,
        containerName: this.containerName
      }, 'AzureStorage');
    } catch (error) {
      logError('Failed to initialize Azure Blob Storage client', error, 'AzureStorage');
      this.containerClient = null;
    }
  }

  /**
   * Updates the SAS token and reinitializes the client
   */
  updateSasToken(sasToken: string): void {
    this.sasToken = sasToken;
    logInfo('SAS token updated, reinitializing client', { sasTokenLength: sasToken.length }, 'AzureStorage');
    this.initializeClient();
  }

  /**
   * Validates if the uploaded file is an allowed audio type
   */
  validateAudioFile(file: File): FileValidationResult {
    logDebug('Validating audio file', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }, 'AzureStorage');

    // Check file size (max 100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      logWarn('File size validation failed', {
        fileName: file.name,
        fileSize: file.size,
        maxSize: MAX_FILE_SIZE
      }, 'AzureStorage');
      return {
        isValid: false,
        error: 'File size exceeds 100MB limit'
      };
    }

    // Get file extension
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Check if extension is allowed
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      logWarn('File extension validation failed', {
        fileName: file.name,
        extension: fileExtension,
        allowedExtensions: ALLOWED_EXTENSIONS
      }, 'AzureStorage');
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }

    // Check MIME type if available
    if (file.type) {
      const allowedMimeTypes = Object.keys(ALLOWED_AUDIO_TYPES);
      const isValidMimeType = allowedMimeTypes.some(mimeType => {
        const extensions = ALLOWED_AUDIO_TYPES[mimeType as keyof typeof ALLOWED_AUDIO_TYPES];
        return file.type === mimeType && extensions.includes(fileExtension);
      });

      if (!isValidMimeType) {
        // Sometimes browsers don't set the correct MIME type, so we'll be lenient
        // and only check the extension if MIME type doesn't match
        logWarn('MIME type mismatch detected', {
          fileName: fileName,
          expectedMimeTypes: allowedMimeTypes,
          actualMimeType: file.type
        }, 'AzureStorage');
      }
    }

    logDebug('File validation successful', {
      fileName: file.name,
      fileType: fileExtension
    }, 'AzureStorage');

    return {
      isValid: true,
      fileType: fileExtension
    };
  }

  /**
   * Generates a unique file name while preserving the original extension
   */
  generateUniqueFileName(originalName: string): string {
    const fileExtension = originalName.substring(originalName.lastIndexOf('.'));
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${uniqueId}${fileExtension}`;
    
    logDebug('Generated unique filename', {
      originalName: originalName,
      uniqueFileName: uniqueFileName,
      timestamp: timestamp,
      uniqueId: uniqueId
    }, 'AzureStorage');
    
    return uniqueFileName;
  }

  /**
   * Uploads a file to Azure Blob Storage
   */
  async uploadFile(file: File): Promise<UploadResult> {
    const startTime = Date.now();
    logInfo('Starting file upload', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }, 'AzureStorage');

    try {
      // Check if client is initialized
      if (!this.containerClient) {
        logError('Azure Storage client not initialized', {
          accountName: this.accountName,
          containerName: this.containerName
        }, 'AzureStorage');
        return {
          success: false,
          error: 'Azure Storage client not initialized. Please check configuration.'
        };
      }

      // Validate file first
      const validation = this.validateAudioFile(file);
      if (!validation.isValid) {
        logWarn('File upload failed validation', {
          fileName: file.name,
          error: validation.error
        }, 'AzureStorage');
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate unique file name
      const uniqueFileName = this.generateUniqueFileName(file.name);
      
      logInfo('Uploading file to Azure Blob Storage', {
        originalName: file.name,
        uniqueFileName: uniqueFileName,
        accountName: this.accountName,
        containerName: this.containerName
      }, 'AzureStorage');

      // Create blob client
      const blobClient = this.containerClient.getBlockBlobClient(uniqueFileName);

      // Upload file with better error handling
      try {
        await blobClient.uploadData(file, {
          blobHTTPHeaders: {
            blobContentType: file.type || 'audio/mpeg'
          },
          metadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          }
        });
        
        const uploadTime = Date.now() - startTime;
        logInfo('File uploaded successfully', {
          fileName: file.name,
          uniqueFileName: uniqueFileName,
          uploadTimeMs: uploadTime,
          fileSize: file.size
        }, 'AzureStorage');
        
      } catch (uploadError: any) {
        logError('Azure upload error', {
          fileName: file.name,
          uniqueFileName: uniqueFileName,
          error: uploadError.message,
          code: uploadError.code,
          uploadTimeMs: Date.now() - startTime
        }, 'AzureStorage');
        
        // Check for specific error types
        if (uploadError.message?.includes('fetch')) {
          logError('Network/CORS error detected', {
            fileName: file.name,
            error: uploadError.message
          }, 'AzureStorage');
          return {
            success: false,
            error: 'Upload failed due to network/CORS issues. Please check Azure Storage CORS configuration.'
          };
        }
        
        if (uploadError.code === 'AuthenticationFailed') {
          logError('Azure authentication failed', {
            fileName: file.name,
            accountName: this.accountName
          }, 'AzureStorage');
          return {
            success: false,
            error: 'Authentication failed. Please check your SAS token.'
          };
        }
        
        if (uploadError.code === 'ContainerNotFound') {
          logError('Azure container not found', {
            fileName: file.name,
            containerName: this.containerName
          }, 'AzureStorage');
          return {
            success: false,
            error: 'Container not found. Please verify the container name and permissions.'
          };
        }
        
        throw uploadError; // Re-throw if not a known error type
      }

      // Generate file URL (without SAS token for security)
      const fileUrl = `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${uniqueFileName}`;

      logInfo('Upload completed successfully', {
        fileName: file.name,
        uniqueFileName: uniqueFileName,
        fileUrl: fileUrl,
        totalTimeMs: Date.now() - startTime
      }, 'AzureStorage');

      return {
        success: true,
        fileName: uniqueFileName,
        fileUrl: fileUrl
      };

    } catch (error) {
      const uploadTime = Date.now() - startTime;
      logError('Unexpected error during file upload', {
        fileName: file.name,
        error: error instanceof Error ? error.message : String(error),
        uploadTimeMs: uploadTime
      }, 'AzureStorage');
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        logError('Network fetch error detected', {
          fileName: file.name,
          error: error.message
        }, 'AzureStorage');
        return {
          success: false,
          error: 'Network error: Unable to connect to Azure Storage. This is likely a CORS configuration issue.'
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? `Upload failed: ${error.message}` : 'Upload failed with unknown error'
      };
    }
  }

  /**
   * Uploads multiple files concurrently
   */
  async uploadMultipleFiles(files: File[]): Promise<UploadResult[]> {
    logInfo('Starting multiple file upload', {
      fileCount: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    }, 'AzureStorage');
    
    const uploadPromises = files.map(file => this.uploadFile(file));
    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    logInfo('Multiple file upload completed', {
      totalFiles: files.length,
      successful: successful,
      failed: failed
    }, 'AzureStorage');
    
    return results;
  }

  /**
   * Deletes a file from Azure Blob Storage
   */
  async deleteFile(fileName: string): Promise<boolean> {
    logInfo('Attempting to delete file', { fileName }, 'AzureStorage');
    
    try {
      if (!this.containerClient) {
        logError('Cannot delete file: Azure Storage client not initialized', { fileName }, 'AzureStorage');
        return false;
      }

      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      await blobClient.delete();
      logInfo('File deleted successfully', { fileName }, 'AzureStorage');
      return true;
    } catch (error) {
      logError('Error deleting file', {
        fileName: fileName,
        error: error instanceof Error ? error.message : String(error)
      }, 'AzureStorage');
      return false;
    }
  }

  /**
   * Gets a file URL for downloading/playing (implements StorageService interface)
   */
  getFileUrl(fileName: string): string {
    if (!this.accountName || !this.containerName || !this.sasToken) {
      return '';
    }
    return `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${fileName}?${this.sasToken}`;
  }

  /**
   * Gets a file URL with SAS token for downloading/playing (legacy method)
   */
  getFileUrlWithSas(fileName: string): string {
    return this.getFileUrl(fileName);
  }

  /**
   * Checks if the service is properly configured and ready for use
   */
  isConfigured(): boolean {
    const configured = !!(this.containerClient && this.accountName && this.containerName && this.sasToken);
    
    if (!configured) {
      logWarn('Azure Storage not properly configured', {
        hasClient: !!this.containerClient,
        hasAccountName: !!this.accountName,
        hasContainerName: !!this.containerName,
        hasSasToken: !!this.sasToken
      }, 'AzureStorage');
    }
    
    return configured;
  }
}