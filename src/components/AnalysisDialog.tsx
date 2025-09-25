import React, { useState, useEffect } from 'react';
import { X, Activity, Loader2, CheckCircle, AlertTriangle, Music, Zap, Target, Radio } from 'lucide-react';
import { AudioAnalysisResult } from '../services/audioAnalysis';

interface AnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trackName: string;
  analysisResult: AudioAnalysisResult | null;
  isAnalyzing: boolean;
}

const AnalysisDialog: React.FC<AnalysisDialogProps> = ({
  isOpen,
  onClose,
  trackName,
  analysisResult,
  isAnalyzing
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      setSelectedTab('overview');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderOverview = () => {
    if (isAnalyzing) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Analyzing Audio</h3>
            <p className="text-gray-400">Please wait while we analyze your track...</p>
          </div>
        </div>
      );
    }

    if (!analysisResult) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Analysis Available</h3>
            <p className="text-gray-400">Analysis has not been performed yet.</p>
          </div>
        </div>
      );
    }

    if (!analysisResult.success) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Analysis Failed</h3>
            <p className="text-red-400">{analysisResult.error}</p>
          </div>
        </div>
      );
    }

    const { analysis } = analysisResult;
    if (!analysis) return null;

    return (
      <div className="space-y-6">
        {/* Analysis Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Radio className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">Frequency Balance</span>
              </div>
              <span className="text-lg font-bold text-white">
                {analysis.frequency_balance.balance_score.toFixed(0)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.frequency_balance.balance_score}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm text-gray-400">Dynamic Range</span>
              </div>
              <span className="text-lg font-bold text-white">
                {analysis.dynamic_range.dynamic_range_score.toFixed(0)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.dynamic_range.dynamic_range_score}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm text-gray-400">Stereo Width</span>
              </div>
              <span className="text-lg font-bold text-white">
                {analysis.stereo_field.width_score.toFixed(0)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.stereo_field.width_score}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Music className="w-5 h-5 text-orange-400 mr-2" />
                <span className="text-sm text-gray-400">Clarity</span>
              </div>
              <span className="text-lg font-bold text-white">
                {analysis.clarity.clarity_score.toFixed(0)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.clarity.clarity_score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Information */}
        {analysis.harmonic_content && analysis.harmonic_content.key !== 'Unknown' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Musical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-400">Key</span>
                <p className="text-lg font-bold text-white">{analysis.harmonic_content.key}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Harmonic Complexity</span>
                <p className="text-lg font-bold text-white">{analysis.harmonic_content.harmonic_complexity.toFixed(0)}%</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Key Consistency</span>
                <p className="text-lg font-bold text-white">{analysis.harmonic_content.key_consistency.toFixed(0)}%</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Chord Changes/min</span>
                <p className="text-lg font-bold text-white">{analysis.harmonic_content.chord_changes_per_minute.toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Time */}
        {analysisResult.processingTime && (
          <div className="text-center text-sm text-gray-500">
            Analysis completed in {(analysisResult.processingTime / 1000).toFixed(1)} seconds
          </div>
        )}
      </div>
    );
  };

  const renderDetailedTab = (section: string) => {
    if (!analysisResult?.success || !analysisResult.analysis) return null;

    const sectionData = analysisResult.analysis[section as keyof typeof analysisResult.analysis];
    if (!sectionData) return null;

    return (
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 capitalize">
            {section.replace('_', ' ')} Details
          </h3>
          
          {/* Render section-specific content */}
          <div className="space-y-3">
            {Object.entries(sectionData).map(([key, value]) => {
              if (key === 'analysis') {
                return (
                  <div key={key}>
                    <span className="text-sm text-gray-400 block mb-2">Analysis Notes:</span>
                    <ul className="list-disc list-inside space-y-1">
                      {(value as string[]).map((note, index) => (
                        <li key={index} className="text-gray-300 text-sm">{note}</li>
                      ))}
                    </ul>
                  </div>
                );
              } else if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                      <div key={subKey}>
                        <span className="text-sm text-gray-400">{subKey.replace('_', ' ')}</span>
                        <p className="text-white font-medium">
                          {typeof subValue === 'number' ? subValue.toFixed(2) : String(subValue)}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400">{key.replace('_', ' ')}</span>
                    <span className="text-white font-medium">
                      {typeof value === 'number' ? value.toFixed(2) : String(value)}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'frequency_balance', label: 'Frequency', icon: Radio },
    { id: 'dynamic_range', label: 'Dynamics', icon: Zap },
    { id: 'stereo_field', label: 'Stereo', icon: Target },
    { id: 'clarity', label: 'Clarity', icon: Music }
  ];

  // Add conditional tabs based on available data
  if (analysisResult?.success && analysisResult.analysis?.transients) {
    tabs.push({ id: 'transients', label: 'Transients', icon: Activity });
  }
  if (analysisResult?.success && analysisResult.analysis?.harmonic_content) {
    tabs.push({ id: 'harmonic_content', label: 'Harmony', icon: Music });
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-6xl h-[85vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Audio Analysis</h2>
              <p className="text-sm text-gray-400">{trackName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {analysisResult?.success && (
              <div className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-4 border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedTab === 'overview' ? renderOverview() : renderDetailedTab(selectedTab)}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDialog;