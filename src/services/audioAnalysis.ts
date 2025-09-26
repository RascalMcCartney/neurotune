// Browser compatibility check
const isServerSide = typeof window === 'undefined';
import { logInfo, logWarn, logError, logDebug } from './logger';

// Conditional imports for Node.js modules
let spawn: any;
let path: any;
let fs: any;

if (isServerSide) {
  try {
    const childProcess = require('child_process');
    spawn = childProcess.spawn;
    path = require('path');
    fs = require('fs');
  } catch (error) {
    logWarn('Failed to load Node.js modules for audio analysis', { error }, 'AudioAnalysis');
  }
}

export interface AudioAnalysisResult {
  success: boolean;
  analysis?: {
    frequency_balance: {
      balance_score: number;
      band_energy: Record<string, number>;
      analysis: string[];
    };
    dynamic_range: {
      dynamic_range_score: number;
      dynamic_range_db: number;
      crest_factor_db: number;
      plr: number;
      analysis: string[];
    };
    stereo_field: {
      width_score: number;
      phase_score: number;
      correlation: number;
      mid_ratio: number;
      side_ratio: number;
      analysis: string[];
    };
    clarity: {
      clarity_score: number;
      spectral_contrast: number;
      spectral_flatness: number;
      spectral_centroid: number;
      analysis: string[];
    };
    transients?: {
      transients_score: number;
      attack_time: number;
      transient_density: number;
      percussion_energy: number;
      analysis: string[];
    };
    harmonic_content?: {
      key: string;
      harmonic_complexity: number;
      key_consistency: number;
      chord_changes_per_minute: number;
      analysis: string[];
      key_relationships?: any;
      top_key_candidates?: Array<{ key: string; confidence: number }>;
    };
  };
  error?: string;
  processingTime?: number;
}

class AudioAnalysisService {
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    if (isServerSide && path) {
      // Configure Python path - adjust as needed for your environment
      this.pythonPath = process.env.PYTHON_PATH || 'python3';
      this.scriptPath = path.join(process.cwd(), 'src', 'audioProcessor', 'core', 'audio_analyzer.py');
      
      logInfo('Audio Analysis Service initialized', {
        pythonPath: this.pythonPath,
        scriptPath: this.scriptPath
      }, 'AudioAnalysis');
    } else {
      this.pythonPath = '';
      this.scriptPath = '';
      logWarn('Audio Analysis Service initialized in browser mode - limited functionality', {}, 'AudioAnalysis');
    }
  }

  /**
   * Analyzes an audio file using the Python audio_analyzer.py script
   * @param filePath - Local file path or URL to the audio file
   * @param options - Optional analysis parameters
   * @returns Promise with analysis results
   */
  async analyzeAudio(filePath: string, options: {
    detailed?: boolean;
    includeAI?: boolean;
    outputPath?: string;
  } = {}): Promise<AudioAnalysisResult> {
    logInfo('Starting audio analysis', {
      filePath: filePath,
      options: options
    }, 'AudioAnalysis');
    
    // Check if we're in browser environment
    if (!isServerSide) {
      logWarn('Audio analysis requested in browser environment', {}, 'AudioAnalysis');
      return {
        success: false,
        error: 'Audio analysis is only available on the server side. This functionality requires a backend API.'
      };
    }

    // Check if Node.js modules are available
    if (!spawn || !path) {
      logError('Node.js modules not available for audio analysis', {}, 'AudioAnalysis');
      return {
        success: false,
        error: 'Node.js modules not available for audio analysis.'
      };
    }

    return new Promise((resolve) => {
      const startTime = Date.now();
      
      // Prepare arguments for the Python script
      const args = [this.scriptPath, 'analyze_mix', filePath];
      
      // Add optional parameters
      if (options.detailed) {
        args.push('--detailed');
      }
      if (options.includeAI) {
        args.push('--include-ai');
      }
      if (options.outputPath) {
        args.push('--output', options.outputPath);
      }

      // Add JSON output format flag
      args.push('--format', 'json');

      logInfo('Executing Python analysis script', {
        pythonPath: this.pythonPath,
        args: args,
        filePath: filePath
      }, 'AudioAnalysis');

      // Spawn the Python process
      const pythonProcess = spawn(this.pythonPath, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PYTHONPATH: path.join(process.cwd(), 'src', 'audioProcessor'),
        }
      });

      let stdout = '';
      let stderr = '';

      // Collect stdout data
      pythonProcess.stdout.on('data', (data: any) => {
        stdout += data.toString();
      });

      // Collect stderr data
      pythonProcess.stderr.on('data', (data: any) => {
        stderr += data.toString();
        logError('Python process stderr output', {
          stderr: data.toString(),
          filePath: filePath
        }, 'AudioAnalysis');
      });

      // Handle process completion
      pythonProcess.on('close', (code: number) => {
        const processingTime = Date.now() - startTime;
        
        logInfo('Python process completed', {
          exitCode: code,
          processingTime: processingTime,
          filePath: filePath
        }, 'AudioAnalysis');
        
        if (code === 0) {
          try {
            // Parse the JSON output from Python
            const analysis = JSON.parse(stdout);
            
            logInfo('Audio analysis completed successfully', {
              filePath: filePath,
              processingTime: processingTime,
              hasAnalysis: !!analysis
            }, 'AudioAnalysis');
            
            resolve({
              success: true,
              analysis,
              processingTime
            });
          } catch (parseError) {
            logError('Failed to parse Python analysis output', {
              parseError: parseError instanceof Error ? parseError.message : String(parseError),
              rawStdout: stdout,
              filePath: filePath,
              processingTime: processingTime
            }, 'AudioAnalysis');
            
            resolve({
              success: false,
              error: `Failed to parse analysis results: ${parseError}`,
              processingTime
            });
          }
        } else {
          logError('Python process failed', {
            exitCode: code,
            stderr: stderr,
            filePath: filePath,
            processingTime: processingTime
          }, 'AudioAnalysis');
          
          resolve({
            success: false,
            error: `Analysis failed with exit code ${code}: ${stderr}`,
            processingTime
          });
        }
      });

      // Handle process errors
      pythonProcess.on('error', (error: any) => {
        const processingTime = Date.now() - startTime;
        logError('Failed to start Python process', {
          error: error.message,
          pythonPath: this.pythonPath,
          filePath: filePath,
          processingTime: processingTime
        }, 'AudioAnalysis');
        
        resolve({
          success: false,
          error: `Failed to start analysis: ${error.message}`,
          processingTime
        });
      });

      // Set a timeout for long-running processes (5 minutes)
      const timeout = setTimeout(() => {
        logError('Audio analysis timed out', {
          filePath: filePath,
          timeoutMs: 5 * 60 * 1000
        }, 'AudioAnalysis');
        
        pythonProcess.kill('SIGTERM');
        resolve({
          success: false,
          error: 'Analysis timed out after 5 minutes',
          processingTime: Date.now() - startTime
        });
      }, 5 * 60 * 1000);

      // Clear timeout when process completes
      pythonProcess.on('close', () => {
        clearTimeout(timeout);
      });
    });
  }

  /**
   * Downloads a file from Azure Blob Storage for local analysis
   * @param azureUrl - The Azure blob URL
   * @param localPath - Where to save the file locally
   * @returns Promise<boolean> - Success status
   */
  private async downloadFromAzure(azureUrl: string, localPath: string): Promise<boolean> {
    if (!isServerSide || !fs || !path) {
      logError('File system operations not available in browser environment', {
        azureUrl: azureUrl,
        localPath: localPath
      }, 'AudioAnalysis');
      return false;
    }

    logInfo('Downloading file from Azure for analysis', {
      azureUrl: azureUrl,
      localPath: localPath
    }, 'AudioAnalysis');

    try {
      const response = await fetch(azureUrl);
      if (!response.ok) {
        logError('Failed to fetch file from Azure', {
          azureUrl: azureUrl,
          status: response.status,
          statusText: response.statusText
        }, 'AudioAnalysis');
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Create directory if it doesn't exist
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logInfo('Created directory for temporary file', { directory: dir }, 'AudioAnalysis');
      }

      // Write file
      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
      
      logInfo('File downloaded successfully from Azure', {
        azureUrl: azureUrl,
        localPath: localPath,
        fileSize: arrayBuffer.byteLength
      }, 'AudioAnalysis');
      
      return true;
    } catch (error) {
      logError('Failed to download file from Azure', {
        azureUrl: azureUrl,
        localPath: localPath,
        error: error instanceof Error ? error.message : String(error)
      }, 'AudioAnalysis');
      return false;
    }
  }

  /**
   * Analyzes an audio file from Azure Blob Storage
   * @param azureFileName - The Azure blob file name
   * @param azureUrl - The full Azure blob URL (with SAS token if needed)
   * @param options - Analysis options
   * @returns Promise with analysis results
   */
  async analyzeFromAzure(
    azureFileName: string, 
    azureUrl: string, 
    options: {
      detailed?: boolean;
      includeAI?: boolean;
      keepLocalFile?: boolean;
    } = {}
  ): Promise<AudioAnalysisResult> {
    logInfo('Starting analysis from Azure file', {
      azureFileName: azureFileName,
      azureUrl: azureUrl,
      options: options
    }, 'AudioAnalysis');
    
    // Check if we're in browser environment
    if (!isServerSide) {
      logWarn('Azure analysis requested in browser environment', {}, 'AudioAnalysis');
      return {
        success: false,
        error: 'Audio analysis is only available on the server side. This functionality requires a backend API.'
      };
    }

    // Check if Node.js modules are available
    if (!path || !fs) {
      logError('File system modules not available for Azure analysis', {}, 'AudioAnalysis');
      return {
        success: false,
        error: 'File system modules not available for audio analysis.'
      };
    }

    // Create a temporary local file path
    const tempDir = path.join(process.cwd(), 'temp', 'audio');
    const localPath = path.join(tempDir, azureFileName);

    try {
      // Download the file from Azure
      const downloadSuccess = await this.downloadFromAzure(azureUrl, localPath);
      
      if (!downloadSuccess) {
        logError('Failed to download file from Azure for analysis', {
          azureFileName: azureFileName,
          azureUrl: azureUrl
        }, 'AudioAnalysis');
        return {
          success: false,
          error: 'Failed to download file from Azure storage'
        };
      }

      // Analyze the local file
      const result = await this.analyzeAudio(localPath, options);

      // Clean up the temporary file unless requested to keep it
      if (!options.keepLocalFile) {
        try {
          fs.unlinkSync(localPath);
          logInfo('Cleaned up temporary analysis file', {
            localPath: localPath,
            azureFileName: azureFileName
          }, 'AudioAnalysis');
        } catch (cleanupError) {
          logWarn('Failed to cleanup temporary file', {
            localPath: localPath,
            error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError)
          }, 'AudioAnalysis');
        }
      }

      return result;
    } catch (error) {
      logError('Error in analyzeFromAzure', {
        azureFileName: azureFileName,
        azureUrl: azureUrl,
        error: error instanceof Error ? error.message : String(error)
      }, 'AudioAnalysis');
      return {
        success: false,
        error: `Analysis failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Checks if the Python environment and dependencies are available
   * @returns Promise<boolean> - Whether the analysis environment is ready
   */
  async checkEnvironment(): Promise<{ ready: boolean; error?: string }> {
    logInfo('Checking Python environment for audio analysis', {}, 'AudioAnalysis');
    
    // Check if we're in browser environment
    if (!isServerSide) {
      logWarn('Environment check requested in browser', {}, 'AudioAnalysis');
      return {
        ready: false,
        error: 'Python environment check is only available on the server side.'
      };
    }

    // Check if Node.js modules are available
    if (!spawn) {
      logError('Child process module not available for environment check', {}, 'AudioAnalysis');
      return {
        ready: false,
        error: 'Child process module not available for Python environment check.'
      };
    }

    return new Promise((resolve) => {
      logDebug('Testing Python environment with import check', {}, 'AudioAnalysis');
      
      const pythonProcess = spawn(this.pythonPath, ['-c', 'import librosa, numpy, scipy; print("OK")'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data: any) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data: any) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code: number) => {
        if (code === 0 && stdout.trim() === 'OK') {
          logInfo('Python environment check passed', {
            pythonPath: this.pythonPath,
            stdout: stdout.trim()
          }, 'AudioAnalysis');
          resolve({ ready: true });
        } else {
          logError('Python environment check failed', {
            exitCode: code,
            stderr: stderr,
            stdout: stdout
          }, 'AudioAnalysis');
          resolve({ 
            ready: false, 
            error: `Python environment check failed: ${stderr || 'Unknown error'}` 
          });
        }
      });

      pythonProcess.on('error', (error: any) => {
        logError('Failed to run Python environment check', {
          pythonPath: this.pythonPath,
          error: error.message
        }, 'AudioAnalysis');
        resolve({ 
          ready: false, 
          error: `Failed to run Python: ${error.message}` 
        });
      });
    });
  }
}

// Export singleton instance
export const audioAnalysisService = new AudioAnalysisService();