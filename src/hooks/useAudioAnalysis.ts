import { useState, useCallback } from 'react';
import { audioAnalysisService, AudioAnalysisResult } from '../services/audioAnalysis';
import { logInfo, logError, logWarn } from '../services/logger';

interface UseAudioAnalysisReturn {
  isAnalyzing: boolean;
  lastAnalysisResult: AudioAnalysisResult | null;
  error: string | null;
  analyzeTrack: (azureFileName: string, azureUrl: string, options?: {
    detailed?: boolean;
    includeAI?: boolean;
  }) => Promise<AudioAnalysisResult>;
  checkEnvironment: () => Promise<{ ready: boolean; error?: string }>;
  clearError: () => void;
}

export const useAudioAnalysis = (): UseAudioAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<AudioAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeTrack = useCallback(async (
    azureFileName: string, 
    azureUrl: string, 
    options: {
      detailed?: boolean;
      includeAI?: boolean;
    } = {}
  ): Promise<AudioAnalysisResult> => {
    logInfo('Track analysis requested via hook', {
      azureFileName: azureFileName,
      options: options
    }, 'AudioAnalysisHook');
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await audioAnalysisService.analyzeFromAzure(
        azureFileName, 
        azureUrl, 
        options
      );

      setLastAnalysisResult(result);
      
      if (!result.success) {
        logWarn('Audio analysis completed with errors', {
          azureFileName: azureFileName,
          error: result.error
        }, 'AudioAnalysisHook');
        setError(result.error || 'Analysis failed');
      } else {
        logInfo('Audio analysis completed successfully', {
          azureFileName: azureFileName,
          processingTime: result.processingTime
        }, 'AudioAnalysisHook');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      logError('Audio analysis hook error', {
        azureFileName: azureFileName,
        error: errorMessage
      }, 'AudioAnalysisHook');
      setError(errorMessage);
      
      const failureResult: AudioAnalysisResult = {
        success: false,
        error: errorMessage
      };
      
      setLastAnalysisResult(failureResult);
      return failureResult;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const checkEnvironment = useCallback(async () => {
    logInfo('Environment check requested via hook', {}, 'AudioAnalysisHook');
    return await audioAnalysisService.checkEnvironment();
  }, []);

  const clearError = useCallback(() => {
    logDebug('Clearing analysis error', {}, 'AudioAnalysisHook');
    setError(null);
  }, []);

  return {
    isAnalyzing,
    lastAnalysisResult,
    error,
    analyzeTrack,
    checkEnvironment,
    clearError
  };
};