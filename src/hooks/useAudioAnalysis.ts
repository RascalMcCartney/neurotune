import { useState, useCallback } from 'react';
import { audioAnalysisService, AudioAnalysisResult } from '../services/audioAnalysis';

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
        setError(result.error || 'Analysis failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
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
    return await audioAnalysisService.checkEnvironment();
  }, []);

  const clearError = useCallback(() => {
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