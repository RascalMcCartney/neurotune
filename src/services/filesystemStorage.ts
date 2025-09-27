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

class FilesystemStorageService implements StorageService {
  private uploadPath: string;
  private baseUrl: string;

  constructor(uploadPath: string = '/uploads', baseUrl: string = window.location.origin) {
    this.uploadPath = uploadPath;
    this.baseUrl = baseUrl;
    
    logInfo('Initializing Filesystem Storage Service', {
      uploadPath: this.uploadPath,
      baseUrl: this.baseUrl
    }, 'FilesystemStorage');
  }

  /**
   * Validates if the uploaded file is an allowed audio type
   */
  validateAudioFile(file: File): FileValidationResult {
    logDebug('Validating audio file', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }, 'FilesystemStorage');

    // Check file size (max 100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      logWarn('File size validation failed', {
        fileName: file.name,
        fileSize: file.size,
        maxSize: MAX_FILE_SIZE
      }, 'FilesystemStorage');
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
      }, 'FilesystemStorage');
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
        logWarn('MIME type mismatch detected', {
          fileName: fileName,
          expectedMimeTypes: allowedMimeTypes,
          actualMimeType: file.type
        }, 'FilesystemStorage');
      }
    }

    logDebug('File validation successful', {
      fileName: file.name,
      fileType: fileExtension
    }, 'FilesystemStorage');

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
    }, 'FilesystemStorage');
    
    return uniqueFileName;
  }

  /**
   * Uploads a file using a simulated approach (in browser environment)
   * In a real implementation, this would send the file to a backend endpoint
   */
  async uploadFile(file: File): Promise<UploadResult> {
    const startTime = Date.now();
    logInfo('Starting file upload', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }, 'FilesystemStorage');

    try {
      // Validate file first
      const validation = this.validateAudioFile(file);
      if (!validation.isValid) {
        logWarn('File upload failed validation', {
          fileName: file.name,
          error: validation.error
        }, 'FilesystemStorage');
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate unique file name
      const uniqueFileName = this.generateUniqueFileName(file.name);

      // Simulate upload process
      // In a real implementation, you would send this to your backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', uniqueFileName);
      formData.append('originalName', file.name);

      logInfo('Attempting backend upload', {
        fileName: file.name,
        uniqueFileName: uniqueFileName,
        endpoint: '/api/upload'
      }, 'FilesystemStorage');
      try {
        // Simulate API call to backend upload endpoint
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          logError('Backend upload failed', {
            fileName: file.name,
            status: response.status,
            statusText: response.statusText
          }, 'FilesystemStorage');
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
          const uploadTime = Date.now() - startTime;
          logInfo('Backend upload successful', {
            fileName: file.name,
            uniqueFileName: uniqueFileName,
            uploadTimeMs: uploadTime
          }, 'FilesystemStorage');
          
          return {
            success: true,
            fileName: uniqueFileName,
            fileUrl: `${this.baseUrl}${this.uploadPath}/${uniqueFileName}`
          };
        } else {
          logError('Backend upload returned error', {
            fileName: file.name,
            error: result.error
          }, 'FilesystemStorage');
          return {
            success: false,
            error: result.error || 'Upload failed'
          };
        }

      } catch (networkError: any) {
        // Fallback: create a blob URL for demo purposes
        logWarn('Backend upload failed, falling back to blob URL', {
          fileName: file.name,
          error: networkError.message,
          fallbackMode: true
        }, 'FilesystemStorage');
        
        const blobUrl = URL.createObjectURL(file);
        
        // Store file reference in localStorage for demo purposes
        const fileInfo = {
          fileName: uniqueFileName,
          originalName: file.name,
          blobUrl: blobUrl,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`file_${uniqueFileName}`, JSON.stringify(fileInfo));
        
        const uploadTime = Date.now() - startTime;
        logInfo('Fallback upload successful using blob URL', {
          fileName: file.name,
          uniqueFileName: uniqueFileName,
          blobUrl: blobUrl,
          uploadTimeMs: uploadTime
        }, 'FilesystemStorage');
        
        return {
          success: true,
          fileName: uniqueFileName,
          fileUrl: blobUrl
        };
      }

    } catch (error) {
      const uploadTime = Date.now() - startTime;
      logError('Unexpected error during file upload', {
        fileName: file.name,
        error: error instanceof Error ? error.message : String(error),
        uploadTimeMs: uploadTime
      }, 'FilesystemStorage');
      
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
    }, 'FilesystemStorage');
    
    const uploadPromises = files.map(file => this.uploadFile(file));
    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    logInfo('Multiple file upload completed', {
      totalFiles: files.length,
      successful: successful,
      failed: failed
    }, 'FilesystemStorage');
    
    return results;
  }

  /**
   * Deletes a file from filesystem storage
   */
  async deleteFile(fileName: string): Promise<boolean> {
    logInfo('Attempting to delete file', { fileName }, 'FilesystemStorage');
    
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch(`/api/upload/${fileName}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        logInfo('File deleted successfully via backend', { fileName }, 'FilesystemStorage');
        return true;
      } else {
        logError('Backend delete failed', {
          fileName: fileName,
          status: response.status,
          statusText: response.statusText
        }, 'FilesystemStorage');
        return false;
      }
    } catch (error) {
      // Fallback: remove from localStorage for demo
      localStorage.removeItem(`file_${fileName}`);
      logWarn('Backend delete failed, removed from localStorage', {
        fileName: fileName,
        error: error instanceof Error ? error.message : String(error)
      }, 'FilesystemStorage');
      return true;
    }
  }

  /**
   * Gets a file URL for downloading/playing
   */
  getFileUrl(fileName: string): string {
    // Check if file exists in localStorage (demo mode)
    const fileInfo = localStorage.getItem(`file_${fileName}`);
    if (fileInfo) {
      const parsed = JSON.parse(fileInfo);
      logDebug('Retrieved file URL from localStorage', {
        fileName: fileName,
        blobUrl: parsed.blobUrl
      }, 'FilesystemStorage');
      return parsed.blobUrl;
    }
    
    // Return standard URL path
    const fileUrl = `${this.baseUrl}${this.uploadPath}/${fileName}`;
    logDebug('Generated standard file URL', {
      fileName: fileName,
      fileUrl: fileUrl
    }, 'FilesystemStorage');
    return fileUrl;
  }

  /**
   * Checks if the service is properly configured
   */
  isConfigured(): boolean {
    const configured = !!(this.uploadPath && this.baseUrl);
    
    if (!configured) {
      logWarn('Filesystem Storage not properly configured', {
        hasUploadPath: !!this.uploadPath,
        hasBaseUrl: !!this.baseUrl
      }, 'FilesystemStorage');
    }
    
    return configured;
  }
}

export { FilesystemStorageService };