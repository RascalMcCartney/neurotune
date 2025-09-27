import React, { useState, useEffect } from 'react';
import { Cloud, HardDrive, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import { StorageFactory } from '../services/storageFactory';
import { storageConfig } from '../config/storage';

const StorageStatus: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [provider, setProvider] = useState<string>('');

  useEffect(() => {
    const checkStatus = () => {
      setIsConfigured(StorageFactory.isConfigured());
      setProvider(StorageFactory.getCurrentProvider());
    };

    checkStatus();
    
    // Check status periodically
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getProviderIcon = () => {
    return provider === 'azure' ? <Cloud className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />;
  };

  const getStatusIcon = () => {
    return isConfigured ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-yellow-400" />
    );
  };

  const getProviderName = () => {
    return provider === 'azure' ? 'Azure Blob Storage' : 'Filesystem Storage';
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        {getProviderIcon()}
        <span className="text-gray-400">Storage:</span>
        <span className="text-white font-medium">{getProviderName()}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        {getStatusIcon()}
        <span className={isConfigured ? 'text-green-400' : 'text-yellow-400'}>
          {isConfigured ? 'Ready' : 'Check Config'}
        </span>
      </div>
    </div>
  );
};

export default StorageStatus;