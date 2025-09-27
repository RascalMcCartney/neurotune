export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: string;
}

export interface UploadResult {
  success: boolean;
  fileName?: string;
  fileUrl?: string;
  error?: string;
}

export interface StorageConfig {
  provider: 'azure' | 'filesystem';
  azure?: {
    accountName: string;
    containerName: string;
    sasToken: string;
  };
  filesystem?: {
    uploadPath: string;
    baseUrl: string;
  };
}

export interface StorageService {
  validateAudioFile(file: File): FileValidationResult;
  generateUniqueFileName(originalName: string): string;
  uploadFile(file: File): Promise<UploadResult>;
  uploadMultipleFiles(files: File[]): Promise<UploadResult[]>;
  deleteFile(fileName: string): Promise<boolean>;
  getFileUrl(fileName: string): string;
  isConfigured(): boolean;
}