import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

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

interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: string;
}

interface UploadResult {
  success: boolean;
  fileName?: string;
  fileUrl?: string;
  error?: string;
}

class AzureStorageService {
  private containerClient: ContainerClient | null = null;
  private accountName: string;
  private containerName: string;
  private sasToken: string;

  constructor() {
    // Get configuration from environment variables
    this.accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || '';
    this.containerName = import.meta.env.VITE_AZURE_CONTAINER_NAME || '';
    this.sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN || '';

    if (this.accountName && this.containerName && this.sasToken) {
      this.initializeClient();
    } else {
      console.warn('Azure Storage configuration missing. Upload operations will fail.');
    }
  }

  /**
   * Initializes the Azure Blob Storage client with SAS token
   */
  private initializeClient(): void {
    try {
      const blobServiceUrl = `https://${this.accountName}.blob.core.windows.net?${this.sasToken}`;
      const blobServiceClient = new BlobServiceClient(blobServiceUrl);
      this.containerClient = blobServiceClient.getContainerClient(this.containerName);
      console.log('Azure Blob Storage client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Azure Blob Storage client:', error);
      this.containerClient = null;
    }
  }

  /**
   * Updates the SAS token and reinitializes the client
   */
  updateSasToken(sasToken: string): void {
    this.sasToken = sasToken;
    this.initializeClient();
  }

  /**
   * Validates if the uploaded file is an allowed audio type
   */
  validateAudioFile(file: File): FileValidationResult {
    // Check file size (max 100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > MAX_FILE_SIZE) {
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
        console.warn(`MIME type mismatch for ${fileName}: expected audio type, got ${file.type}`);
      }
    }

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
    return `${timestamp}_${uniqueId}${fileExtension}`;
  }

  /**
   * Uploads a file to Azure Blob Storage
   */
  async uploadFile(file: File): Promise<UploadResult> {
    try {
      // Check if client is initialized
      if (!this.containerClient) {
        return {
          success: false,
          error: 'Azure Storage client not initialized. Please check configuration.'
        };
      }

      // Validate file first
      const validation = this.validateAudioFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate unique file name
      const uniqueFileName = this.generateUniqueFileName(file.name);

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
      } catch (uploadError: any) {
        console.error('Upload error details:', uploadError);
        
        // Check for specific error types
        if (uploadError.message?.includes('fetch')) {
          return {
            success: false,
            error: 'Upload failed due to network/CORS issues. Please check Azure Storage CORS configuration.'
          };
        }
        
        if (uploadError.code === 'AuthenticationFailed') {
          return {
            success: false,
            error: 'Authentication failed. Please check your SAS token.'
          };
        }
        
        if (uploadError.code === 'ContainerNotFound') {
          return {
            success: false,
            error: 'Container not found. Please verify the container name and permissions.'
          };
        }
        
        throw uploadError; // Re-throw if not a known error type
      }

      // Generate file URL (without SAS token for security)
      const fileUrl = `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${uniqueFileName}`;

      return {
        success: true,
        fileName: uniqueFileName,
        fileUrl: fileUrl
      };

    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
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
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Deletes a file from Azure Blob Storage
   */
  async deleteFile(fileName: string): Promise<boolean> {
    try {
      if (!this.containerClient) {
        console.error('Azure Storage client not initialized');
        return false;
      }

      const blobClient = this.containerClient.getBlockBlobClient(fileName);
      await blobClient.delete();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Gets a file URL with SAS token for downloading/playing
   */
  getFileUrlWithSas(fileName: string): string {
    if (!this.accountName || !this.containerName || !this.sasToken) {
      return '';
    }
    return `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${fileName}?${this.sasToken}`;
  }

  /**
   * Checks if the service is properly configured and ready for use
   */
  isConfigured(): boolean {
    return !!(this.containerClient && this.accountName && this.containerName && this.sasToken);
  }
}

// Export singleton instance
export const azureStorageService = new AzureStorageService();