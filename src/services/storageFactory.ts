import { StorageService } from '../types/storage';
import { AzureStorageService } from './azureStorage';
import { FilesystemStorageService } from './filesystemStorage';
import { storageConfig } from '../config/storage';

class StorageFactory {
  private static instance: StorageService | null = null;

  /**
   * Get the configured storage service instance
   */
  static getStorageService(): StorageService {
    if (!this.instance) {
      this.instance = this.createStorageService();
    }
    return this.instance;
  }

  /**
   * Create a storage service based on configuration
   */
  private static createStorageService(): StorageService {
    const provider = storageConfig.provider;
    
    console.log(`Initializing storage provider: ${provider}`);

    switch (provider) {
      case 'azure':
        if (!storageConfig.azure) {
          console.error('Azure configuration not found, falling back to filesystem');
          return this.createFilesystemService();
        }
        return new AzureStorageService(
          storageConfig.azure.accountName,
          storageConfig.azure.containerName,
          storageConfig.azure.sasToken
        );

      case 'filesystem':
        return this.createFilesystemService();

      default:
        console.warn(`Unknown storage provider: ${provider}, falling back to filesystem`);
        return this.createFilesystemService();
    }
  }

  /**
   * Create filesystem storage service with config
   */
  private static createFilesystemService(): StorageService {
    const config = storageConfig.filesystem;
    return new FilesystemStorageService(
      config?.uploadPath || '/uploads',
      config?.baseUrl || window.location.origin
    );
  }

  /**
   * Reset the singleton instance (useful for testing or config changes)
   */
  static resetInstance(): void {
    this.instance = null;
  }

  /**
   * Get current provider name
   */
  static getCurrentProvider(): string {
    return storageConfig.provider;
  }

  /**
   * Check if current provider is properly configured
   */
  static isConfigured(): boolean {
    const service = this.getStorageService();
    return service.isConfigured();
  }
}

// Export the factory and a convenience function
export { StorageFactory };

// Convenience function to get storage service
export const getStorageService = (): StorageService => {
  return StorageFactory.getStorageService();
};