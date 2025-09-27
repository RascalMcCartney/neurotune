import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Music, 
  FolderOpen, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  FileAudio,
  Clock,
  User,
  Disc,
  Calendar,
  Hash,
  Activity,
  Key,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { getStorageService } from '../services/storageFactory';
import { ALLOWED_EXTENSIONS } from '../services/azureStorage';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';
import AnalysisDialog from './AnalysisDialog';
import { logInfo, logError, logWarn, logDebug } from '../services/logger';

interface Track {
  id: string;
  file: File;
  azureFileName?: string;
  azureFileUrl?: string;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string;
  analysisStatus?: 'pending' | 'analyzing' | 'complete' | 'error';
  analysisResult?: any;
  name: string;
  artist: string;
  album: string;
  genre: string;
  year: string;
  duration: string;
  bpm: string;
  key: string;
  energy: string;
  isCompleted: boolean;
}

interface AddTrackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTracksAdded: (tracks: Track[]) => void;
  mode: 'single' | 'multiple' | 'folder';
}

const AddTrackDialog: React.FC<AddTrackDialogProps> = ({
  isOpen,
  onClose,
  onTracksAdded,
  mode = 'single'
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [selectedTrackForAnalysis, setSelectedTrackForAnalysis] = useState<Track | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const { analyzeTrack, isAnalyzing, lastAnalysisResult, error: analysisError } = useAudioAnalysis();

  if (!isOpen) return null;

  const currentTrack = tracks[selectedTrackIndex];

  const createTrackFromFile = (file: File): Track => ({
    id: `${Date.now()}-${Math.random()}`,
    file,
    uploadStatus: 'pending',
    name: file.name.replace(/\.[^/.]+$/, ""),
    artist: '',
    album: '',
    genre: '',
    year: new Date().getFullYear().toString(),
    duration: '',
    bpm: '',
    key: '',
    energy: '',
    isCompleted: false
  });
  
  // Get storage service instance
  const storageService = getStorageService();
  
  const analyzeUploadedTrack = async (track: Track) => {
    if (!track.azureFileName || !track.azureFileUrl) {
      logWarn('Cannot analyze track: missing Azure file information', {
        trackId: track.id,
        trackName: track.name,
        hasAzureFileName: !!track.azureFileName,
        hasAzureFileUrl: !!track.azureFileUrl
      }, 'AddTrackDialog');
      return;
    }
    
    logInfo('Starting track analysis', {
      trackId: track.id,
      trackName: track.name,
      azureFileName: track.azureFileName
    }, 'AddTrackDialog');
    
    // Update track analysis status
    setTracks(prevTracks => 
      prevTracks.map(t => 
        t.id === track.id 
          ? { ...t, analysisStatus: 'analyzing' }
          : t
      )
    );
    
    try {
      const analysisResult = await analyzeTrack(track.azureFileName, track.azureFileUrl, {
        detailed: true,
        includeAI: false // Set to true if you want AI-powered insights
      });
      
      logInfo('Track analysis completed', {
        trackId: track.id,
        trackName: track.name,
        success: analysisResult.success,
        processingTime: analysisResult.processingTime
      }, 'AddTrackDialog');
      
      // Update track with analysis results
      setTracks(prevTracks => 
        prevTracks.map(t => 
          t.id === track.id 
            ? { 
                ...t, 
                analysisStatus: analysisResult.success ? 'complete' : 'error',
                analysisResult: analysisResult.success ? analysisResult.analysis : null
              }
            : t
        )
      );
      
      // Auto-fill some fields from analysis if available
      if (analysisResult.success && analysisResult.analysis) {
        const analysis = analysisResult.analysis;
        logDebug('Auto-filling track metadata from analysis', {
          trackId: track.id,
          detectedKey: analysis.harmonic_content?.key
        }, 'AddTrackDialog');
        
        setTracks(prevTracks => 
          prevTracks.map(t => 
            t.id === track.id 
              ? { 
                  ...t,
                  key: analysis.harmonic_content?.key !== 'Unknown' ? analysis.harmonic_content?.key || t.key : t.key,
                  // You can add more auto-fill logic here based on the analysis
                }
              : t
          )
        );
      }
      
    } catch (error) {
      logError('Track analysis failed with exception', {
        trackId: track.id,
        trackName: track.name,
        error: error instanceof Error ? error.message : String(error)
      }, 'AddTrackDialog');
      
      setTracks(prevTracks => 
        prevTracks.map(t => 
          t.id === track.id 
            ? { ...t, analysisStatus: 'error' }
            : t
        )
      );
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    logInfo('Files selected for upload', {
      fileCount: files.length,
      mode: mode
    }, 'AddTrackDialog');
    
    const audioFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(files).forEach(file => {
      const validation = storageService.validateAudioFile(file);
      if (validation.isValid) {
        audioFiles.push(file);
      } else {
        invalidFiles.push(`${file.name}: ${validation.error}`);
      }
    });
    
    logInfo('File validation completed', {
      totalFiles: files.length,
      validFiles: audioFiles.length,
      invalidFiles: invalidFiles.length,
      invalidFileDetails: invalidFiles
    }, 'AddTrackDialog');
    
    if (invalidFiles.length > 0) {
      logWarn('Some files failed validation', { invalidFiles }, 'AddTrackDialog');
      alert(`Invalid files found:\n\n${invalidFiles.join('\n')}\n\nSupported formats: ${ALLOWED_EXTENSIONS.join(', ')}`);
    }
    
    if (audioFiles.length > 0) {
      const newTracks = audioFiles.map(createTrackFromFile);
      logInfo('Adding tracks to dialog', {
        newTrackCount: newTracks.length,
        trackNames: newTracks.map(t => t.name)
      }, 'AddTrackDialog');
      setTracks(prevTracks => [...prevTracks, ...newTracks]);
      if (tracks.length === 0) {
        setSelectedTrackIndex(0);
      }
    }
  };

  const handleSingleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = ALLOWED_EXTENSIONS.join(',') + ',audio/*';
      fileInputRef.current.multiple = mode === 'multiple';
      fileInputRef.current.click();
    }
  };

  const handleFolderUpload = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  const updateCurrentTrack = (field: keyof Track, value: string) => {
    if (!currentTrack) return;
    
    setTracks(prevTracks => 
      prevTracks.map((track, index) => 
        index === selectedTrackIndex 
          ? { ...track, [field]: value }
          : track
      )
    );
  };

  const markCurrentTrackComplete = () => {
    if (!currentTrack) return;
    
    const isComplete = currentTrack.name.trim() !== '' && currentTrack.artist.trim() !== '';
    
    setTracks(prevTracks => 
      prevTracks.map((track, index) => 
        index === selectedTrackIndex 
          ? { ...track, isCompleted: isComplete }
          : track
      )
    );
  };

  const removeTrack = (indexToRemove: number) => {
    setTracks(prevTracks => {
      const newTracks = prevTracks.filter((_, index) => index !== indexToRemove);
      
      if (newTracks.length === 0) {
        return [];
      }
      
      if (selectedTrackIndex >= indexToRemove && selectedTrackIndex > 0) {
        setSelectedTrackIndex(selectedTrackIndex - 1);
      } else if (selectedTrackIndex >= newTracks.length) {
        setSelectedTrackIndex(newTracks.length - 1);
      }
      
      return newTracks;
    });
  };

  const uploadTrackFiles = async (tracksToUpload: Track[]): Promise<Track[]> => {
    logInfo('Starting batch upload process', {
      trackCount: tracksToUpload.length,
      trackNames: tracksToUpload.map(t => t.name)
    }, 'AddTrackDialog');
    
    const updatedTracks = [...tracksToUpload];
    
    for (let i = 0; i < updatedTracks.length; i++) {
      const track = updatedTracks[i];
      
      // Skip if already uploaded
      if (track.uploadStatus === 'success') {
        logDebug('Skipping already uploaded track', {
          trackId: track.id,
          trackName: track.name
        }, 'AddTrackDialog');
        continue;
      }
      
      logInfo('Uploading track file', {
        trackId: track.id,
        trackName: track.name,
        fileName: track.file.name,
        fileSize: track.file.size
      }, 'AddTrackDialog');
      
      // Update status to uploading
      updatedTracks[i] = { ...track, uploadStatus: 'uploading' };
      setTracks([...updatedTracks]);
      
      try {
        // Upload file using configured storage service
        const uploadResult = await storageService.uploadFile(track.file);
        
        if (uploadResult.success) {
          logInfo('Track file uploaded successfully', {
            trackId: track.id,
            trackName: track.name,
            azureFileName: uploadResult.fileName,
            azureFileUrl: uploadResult.fileUrl
          }, 'AddTrackDialog');
          
          updatedTracks[i] = {
            ...track,
            uploadStatus: 'success',
            azureFileName: uploadResult.fileName,
            azureFileUrl: uploadResult.fileUrl,
            uploadError: undefined
          };
        } else {
          logError('Track file upload failed', {
            trackId: track.id,
            trackName: track.name,
            error: uploadResult.error
          }, 'AddTrackDialog');
          
          updatedTracks[i] = {
            ...track,
            uploadStatus: 'error',
            uploadError: uploadResult.error || 'Upload failed'
          };
        }
      } catch (error) {
        logError('Track file upload exception', {
          trackId: track.id,
          trackName: track.name,
          error: error instanceof Error ? error.message : String(error)
        }, 'AddTrackDialog');
        
        updatedTracks[i] = {
          ...track,
          uploadStatus: 'error',
          uploadError: error instanceof Error ? error.message : 'Upload failed'
        };
      }
      
      setTracks([...updatedTracks]);
    }
    
    const successfulUploads = updatedTracks.filter(t => t.uploadStatus === 'success').length;
    const failedUploads = updatedTracks.filter(t => t.uploadStatus === 'error').length;
    
    logInfo('Batch upload process completed', {
      totalTracks: updatedTracks.length,
      successful: successfulUploads,
      failed: failedUploads
    }, 'AddTrackDialog');
    
    return updatedTracks;
  };

  const handleSave = async () => {
    if (tracks.length === 0) return;
    
    logInfo('Starting save process', {
      trackCount: tracks.length,
      completedTracks: tracks.filter(t => t.isCompleted).length
    }, 'AddTrackDialog');
    
    setIsProcessing(true);
    
    try {
      // Upload all files to Azure
      const uploadedTracks = await uploadTrackFiles(tracks);
      
      // Check if all uploads were successful
      const failedUploads = uploadedTracks.filter(track => track.uploadStatus === 'error');
      
      if (failedUploads.length > 0) {
        logError('Some track uploads failed', {
          failedCount: failedUploads.length,
          failedTracks: failedUploads.map(t => ({ name: t.name, error: t.uploadError }))
        }, 'AddTrackDialog');
        
        const errorMessage = `Failed to upload ${failedUploads.length} file(s):\n\n${
          failedUploads.map(track => `${track.name}: ${track.uploadError}`).join('\n')
        }`;
        alert(errorMessage);
        setIsProcessing(false);
        return;
      }
      
      logInfo('All tracks uploaded successfully', {
        trackCount: uploadedTracks.length
      }, 'AddTrackDialog');
      
      // All uploads successful, return the tracks
      onTracksAdded(uploadedTracks);
      
      // Start analysis for successfully uploaded tracks
      uploadedTracks.forEach(track => {
        if (track.uploadStatus === 'success') {
          analyzeUploadedTrack(track);
        }
      });
      
      setIsProcessing(false);
      onClose();
      
    } catch (error) {
      logError('Error in save process', {
        error: error instanceof Error ? error.message : String(error),
        trackCount: tracks.length
      }, 'AddTrackDialog');
      alert('An unexpected error occurred while saving tracks');
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setTracks([]);
    setSelectedTrackIndex(0);
    setUploadProgress({});
  };

  const getProgressStats = () => {
    const completed = tracks.filter(t => t.isCompleted).length;
    const uploaded = tracks.filter(t => t.uploadStatus === 'success').length;
    const failed = tracks.filter(t => t.uploadStatus === 'error').length;
    const analyzed = tracks.filter(t => t.analysisStatus === 'complete').length;
    const analyzing = tracks.filter(t => t.analysisStatus === 'analyzing').length;
    return { completed, uploaded, failed, analyzed, analyzing, total: tracks.length };
  };
  
  const handleViewAnalysis = (track: Track) => {
    setSelectedTrackForAnalysis(track);
    setShowAnalysisDialog(true);
  };

  const stats = getProgressStats();

  const renderEmptyState = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          {mode === 'folder' ? (
            <FolderOpen className="w-12 h-12 text-white" />
          ) : (
            <Upload className="w-12 h-12 text-white" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3">
          {mode === 'folder' ? 'Import Folder' : `Add ${mode === 'single' ? 'Single' : 'Multiple'} Track${mode === 'multiple' ? 's' : ''}`}
        </h3>
        
        <p className="text-gray-400 mb-6">
          {mode === 'folder' 
            ? 'Select a folder containing audio files to import all tracks at once'
            : mode === 'single'
            ? 'Upload a single audio file and add its details'
            : 'Upload multiple audio files and customize each track\'s information'
          }
        </p>
        
        <div className="space-y-3">
          {mode === 'folder' ? (
            <button
              onClick={handleFolderUpload}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <FolderOpen className="w-5 h-5" />
              <span>Select Folder</span>
            </button>
          ) : (
            <button
              onClick={handleSingleFileUpload}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Select Audio File{mode === 'multiple' ? 's' : ''}</span>
            </button>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">
            <strong>Supported formats:</strong> MP3, WAV, FLAC, AAC, OGG, M4A
          </p>
          <p className="text-xs text-gray-400">
            Maximum file size: 100MB per file
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-6xl h-[85vh] mx-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {mode === 'folder' ? (
                <FolderOpen className="w-6 h-6 text-blue-400" />
              ) : (
                <Music className="w-6 h-6 text-green-400" />
              )}
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === 'folder' ? 'Import Folder' : `Add ${mode === 'single' ? 'Track' : 'Tracks'}`}
                </h2>
                {tracks.length > 0 && (
                  <p className="text-sm text-gray-400">
                    {stats.completed} of {stats.total} completed • {stats.uploaded} uploaded • {stats.failed} failed
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {tracks.length > 0 && (
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Clear all tracks"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex min-h-0">
            {tracks.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {/* Track List Sidebar (for multiple tracks) */}
                {(mode === 'multiple' || mode === 'folder') && tracks.length > 1 && (
                  <div className="w-80 border-r border-gray-700 bg-gray-800/50">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Track List</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{tracks.length} tracks</span>
                        <span>{stats.completed} completed</span>
                      </div>
                      {tracks.length > 0 && (
                        <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 space-y-2">
                        {tracks.map((track, index) => (
                          <div
                            key={track.id}
                            onClick={() => setSelectedTrackIndex(index)}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                              index === selectedTrackIndex
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  track.uploadStatus === 'success'
                                    ? 'bg-green-500 text-white'
                                    : track.uploadStatus === 'error'
                                    ? 'bg-red-500 text-white'
                                    : track.uploadStatus === 'uploading'
                                    ? 'bg-yellow-500 text-white'
                                    : track.isCompleted 
                                    ? 'bg-blue-500 text-white' 
                                    : index === selectedTrackIndex
                                    ? 'bg-blue-800 text-blue-200'
                                    : 'bg-gray-600 text-gray-300'
                                }`}>
                                  {track.uploadStatus === 'success' ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : track.uploadStatus === 'error' ? (
                                    <AlertCircle className="w-4 h-4" />
                                  ) : track.uploadStatus === 'uploading' ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : track.isCompleted ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium truncate">
                                    {track.name || track.file.name.replace(/\.[^/.]+$/, "")}
                                  </p>
                                  <p className={`text-sm truncate ${
                                    index === selectedTrackIndex ? 'text-blue-200' : 'text-gray-400'
                                  }`}>
                                    {track.artist || 'Unknown Artist'}
                                  </p>
                                  {track.uploadStatus === 'error' && track.uploadError && (
                                    <p className="text-xs text-red-400 truncate mt-1">
                                      Error: {track.uploadError}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTrack(index);
                                }}
                                className={`p-1 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100 ${
                                  index === selectedTrackIndex
                                    ? 'hover:bg-blue-700 text-blue-200'
                                    : 'hover:bg-gray-500 text-gray-400'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Track Details Form */}
                <div className="flex-1 flex flex-col min-w-0">
                  {currentTrack && (
                    <>
                      {/* Track Navigation (for multiple tracks) */}
                      {tracks.length > 1 && (
                        <div className="p-4 border-b border-gray-700 bg-gray-800/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedTrackIndex(Math.max(0, selectedTrackIndex - 1))}
                                  disabled={selectedTrackIndex === 0}
                                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-400">
                                  {selectedTrackIndex + 1} of {tracks.length}
                                </span>
                                <button
                                  onClick={() => setSelectedTrackIndex(Math.min(tracks.length - 1, selectedTrackIndex + 1))}
                                  disabled={selectedTrackIndex === tracks.length - 1}
                                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                currentTrack.uploadStatus === 'success'
                                  ? 'bg-green-600 text-white'
                                  : currentTrack.uploadStatus === 'error'
                                  ? 'bg-red-600 text-white'
                                  : currentTrack.uploadStatus === 'uploading'
                                  ? 'bg-yellow-600 text-white'
                                  : currentTrack.isCompleted 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-600 text-white'
                              }`}>
                                {currentTrack.uploadStatus === 'success' ? 'Uploaded' :
                                 currentTrack.uploadStatus === 'error' ? 'Upload Failed' :
                                 currentTrack.uploadStatus === 'uploading' ? 'Uploading...' :
                                 currentTrack.isCompleted ? 'Completed' : 'In Progress'}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => removeTrack(selectedTrackIndex)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                              title="Remove this track"
                              disabled={currentTrack.uploadStatus === 'uploading'}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Form */}
                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-2xl mx-auto space-y-6">
                          {/* File Info */}
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <FileAudio className="w-5 h-5 text-blue-400" />
                              <h3 className="text-lg font-semibold text-white">File Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Filename:</span>
                                <p className="text-white font-medium">{currentTrack.file.name}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Size:</span>
                                <p className="text-white font-medium">{(currentTrack.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                              {currentTrack.azureFileName && (
                                <div className="md:col-span-2">
                                  <span className="text-gray-400">Storage ID:</span>
                                  <p className="text-green-400 font-mono text-xs">{currentTrack.azureFileName}</p>
                                </div>
                              )}
                              {currentTrack.uploadStatus === 'error' && currentTrack.uploadError && (
                                <div className="md:col-span-2 p-3 bg-red-900/20 border border-red-700/50 rounded">
                                  <div className="flex items-center space-x-2">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <span className="text-red-300 text-sm font-medium">Upload Error:</span>
                                    {/* Analysis Status */}
                                    {currentTrack.analysisStatus && currentTrack.uploadStatus === 'success' && (
                                      <div className="flex items-center space-x-1 mt-1">
                                        {currentTrack.analysisStatus === 'analyzing' && (
                                          <>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                            <span className="text-xs text-blue-400">Analyzing...</span>
                                          </>
                                        )}
                                        {currentTrack.analysisStatus === 'complete' && (
                                          <>
                                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                                            <span className="text-xs text-green-400">Analyzed</span>
                                          </>
                                        )}
                                        {currentTrack.analysisStatus === 'error' && (
                                          <>
                                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                                            <span className="text-xs text-red-400">Analysis failed</span>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-red-200 text-sm mt-1">{currentTrack.uploadError}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Basic Details */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                              <Music className="w-5 h-5 mr-2 text-green-400" />
                              Track Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Track Name *
                                </label>
                                <input
                                  type="text"
                                  value={currentTrack.name}
                                  onChange={(e) => updateCurrentTrack('name', e.target.value)}
                                  onBlur={markCurrentTrackComplete}
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                  placeholder="Enter track name"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Artist *
                                </label>
                                <div className="relative">
                                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="text"
                                    value={currentTrack.artist}
                                    onChange={(e) => updateCurrentTrack('artist', e.target.value)}
                                    onBlur={markCurrentTrackComplete}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="Enter artist name"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Album
                                </label>
                                <div className="relative">
                                  <Disc className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="text"
                                    value={currentTrack.album}
                                    onChange={(e) => updateCurrentTrack('album', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="Enter album name"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Genre
                                </label>
                                <input
                                  type="text"
                                  value={currentTrack.genre}
                                  onChange={(e) => updateCurrentTrack('genre', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                  placeholder="Enter genre"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Additional Metadata */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Additional Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Year
                                </label>
                                <div className="relative">
                                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="number"
                                    value={currentTrack.year}
                                    onChange={(e) => updateCurrentTrack('year', e.target.value)}
                                    min="1900"
                                    max="2030"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="2024"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Duration
                                </label>
                                <div className="relative">
                                  <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="text"
                                    value={currentTrack.duration}
                                    onChange={(e) => updateCurrentTrack('duration', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="3:45"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  BPM
                                </label>
                                <div className="relative">
                                  <Activity className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <input
                                    type="number"
                                    value={currentTrack.bpm}
                                    onChange={(e) => updateCurrentTrack('bpm', e.target.value)}
                                    min="1"
                                    max="300"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="120"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Musical Key
                                </label>
                                <div className="relative">
                                  <Key className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                  <select
                                    value={currentTrack.key}
                                    onChange={(e) => updateCurrentTrack('key', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                  >
                                    <option value="">Select key</option>
                                    <option value="C">C Major</option>
                                    <option value="C#">C# Major</option>
                                    <option value="D">D Major</option>
                                    <option value="D#">D# Major</option>
                                    <option value="E">E Major</option>
                                    <option value="F">F Major</option>
                                    <option value="F#">F# Major</option>
                                    <option value="G">G Major</option>
                                    <option value="G#">G# Major</option>
                                    <option value="A">A Major</option>
                                    <option value="A#">A# Major</option>
                                    <option value="B">B Major</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Energy Level
                                </label>
                                <select
                                  value={currentTrack.energy}
                                  onChange={(e) => updateCurrentTrack('energy', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                >
                                  <option value="">Select energy</option>
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                  <option value="very-high">Very High</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {tracks.length > 0 && (
            <div className="p-6 border-t border-gray-700 bg-gray-800/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {tracks.length} track{tracks.length !== 1 ? 's' : ''} ready to import
                  {(stats.completed < stats.total || stats.failed > 0) && (
                    <span className="ml-2 text-yellow-400">
                      ({stats.total - stats.completed} incomplete
                      {stats.failed > 0 && `, ${stats.failed} failed`})
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isProcessing || tracks.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Upload & Add Track{tracks.length > 1 ? 's' : ''}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <input
        ref={folderInputRef}
        type="file"
        className="hidden"
        {...({ webkitdirectory: "true" } as any)}
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      
      {/* Analysis Dialog */}
      <AnalysisDialog
        isOpen={showAnalysisDialog}
        onClose={() => setShowAnalysisDialog(false)}
        trackName={selectedTrackForAnalysis?.name || 'Unknown Track'}
        analysisResult={selectedTrackForAnalysis?.analysisResult ? {
          success: true,
          analysis: selectedTrackForAnalysis.analysisResult
        } : null}
        isAnalyzing={selectedTrackForAnalysis?.analysisStatus === 'analyzing'}
      />
    </>
  );
};

export default AddTrackDialog;