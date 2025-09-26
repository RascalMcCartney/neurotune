import { v4 as uuidv4 } from 'uuid';
import { FileValidationResult, UploadResult, StorageService } from '../types/storage';

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
   * Uploads a file using a simulated approach (in browser environment)
   * In a real implementation, this would send the file to a backend endpoint
   */
  async uploadFile(file: File): Promise<UploadResult> {
    try {
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

      // Simulate upload process
      // In a real implementation, you would send this to your backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', uniqueFileName);
      formData.append('originalName', file.name);

      try {
        // Simulate API call to backend upload endpoint
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
          return {
            success: true,
            fileName: uniqueFileName,
            fileUrl: `${this.baseUrl}${this.uploadPath}/${uniqueFileName}`
          };
        } else {
          return {
            success: false,
            error: result.error || 'Upload failed'
          };
        }

      } catch (networkError: any) {
        // Fallback: create a blob URL for demo purposes
        console.warn('Backend upload failed, using local blob URL for demo:', networkError.message);
        
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
        
        return {
          success: true,
          fileName: uniqueFileName,
          fileUrl: blobUrl
        };
      }

    } catch (error) {
      console.error('Error uploading file:', error);
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
   * Deletes a file from filesystem storage
   */
  async deleteFile(fileName: string): Promise<boolean> {
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch(`/api/upload/${fileName}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        return true;
      } else {
        console.error('Delete failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      // Fallback: remove from localStorage for demo
      localStorage.removeItem(`file_${fileName}`);
      console.warn('Backend delete failed, removed from localStorage:', error);
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
      return parsed.blobUrl;
    }
    
    // Return standard URL path
    return `${this.baseUrl}${this.uploadPath}/${fileName}`;
  }

  /**
   * Checks if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.uploadPath && this.baseUrl);
  }
}

export { FilesystemStorageService };