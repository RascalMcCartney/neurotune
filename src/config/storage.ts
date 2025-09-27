import { StorageConfig } from '../types/storage';

// Storage configuration - change this to switch between providers
export const storageConfig: StorageConfig = {
  // Set to 'azure' or 'filesystem'
  provider: import.meta.env.VITE_STORAGE_PROVIDER || 'azure',
  
  azure: {
    accountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || 'neurotunetrackstorage',
    containerName: import.meta.env.VITE_AZURE_CONTAINER_NAME || 'songs',
    sasToken: import.meta.env.VITE_AZURE_SAS_TOKEN || 'sp=racwdli&st=2025-09-26T12:04:45Z&se=2030-09-26T20:19:45Z&sip=82.132.216.101&spr=https&sv=2024-11-04&sr=c&sig=dNPZ%2BOACTko9f3l06DmAaDXN0mcg1tR7h5gkfBXgR54%3D'
  },
  
  filesystem: {
    uploadPath: import.meta.env.VITE_FILESYSTEM_UPLOAD_PATH || '/uploads',
    baseUrl: import.meta.env.VITE_FILESYSTEM_BASE_URL || window.location.origin
  }
};

// Helper function to get current storage provider
export const getCurrentProvider = (): 'azure' | 'filesystem' => {
  return storageConfig.provider;
};

// Helper function to get provider-specific config
export const getProviderConfig = () => {
  if (storageConfig.provider === 'azure') {
    return storageConfig.azure;
  } else {
    return storageConfig.filesystem;
  }
};