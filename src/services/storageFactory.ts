import { StorageService } from '../types/storage';
import { AzureStorageService } from './azureStorage';
import { FilesystemStorageService } from './filesystemStorage';
import { storageConfig } from '../config/storage';
import { logInfo, logWarn, logError, logDebug } from './logger';

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
    
    logInfo('Initializing storage provider', { provider }, 'StorageFactory');

    switch (provider) {
      case 'azure':
        if (!storageConfig.azure) {
          logError('Azure configuration not found, falling back to filesystem', {}, 'StorageFactory');
          return this.createFilesystemService();
        }
        logInfo('Creating Azure Storage service', {
          accountName: storageConfig.azure.accountName,
          containerName: storageConfig.azure.containerName
        }, 'StorageFactory');
        return new AzureStorageService(
          storageConfig.azure.accountName,
          storageConfig.azure.containerName,
          storageConfig.azure.sasToken
        );

      case 'filesystem':
        logInfo('Creating Filesystem Storage service', {
          uploadPath: storageConfig.filesystem?.uploadPath,
          baseUrl: storageConfig.filesystem?.baseUrl
        }, 'StorageFactory');
        return this.createFilesystemService();

      default:
        logWarn('Unknown storage provider, falling back to filesystem', { provider }, 'StorageFactory');
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
    logInfo('Resetting storage service instance', {}, 'StorageFactory');
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
    const configured = service.isConfigured();
    
    logDebug('Storage configuration check', {
      provider: storageConfig.provider,
      configured: configured
    }, 'StorageFactory');
    
    return configured;
  }
}

// Export the factory and a convenience function
export { StorageFactory };

// Convenience function to get storage service
export const getStorageService = (): StorageService => {
  return StorageFactory.getStorageService();
};