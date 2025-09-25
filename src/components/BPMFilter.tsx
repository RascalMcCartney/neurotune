import React, { useState, useEffect } from 'react';
import { Activity, X } from 'lucide-react';

interface BPMFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onBPMRangeChange: (minBPM: number | null, maxBPM: number | null) => void;
  currentMinBPM: number | null;
  currentMaxBPM: number | null;
}

const BPMFilter: React.FC<BPMFilterProps> = ({
  isOpen,
  onClose,
  onBPMRangeChange,
  currentMinBPM,
  currentMaxBPM
}) => {
  const [minBPM, setMinBPM] = useState<string>(currentMinBPM?.toString() || '');
  const [maxBPM, setMaxBPM] = useState<string>(currentMaxBPM?.toString() || '');

  useEffect(() => {
    if (isOpen) {
      setMinBPM(currentMinBPM?.toString() || '');
      setMaxBPM(currentMaxBPM?.toString() || '');
    }
  }, [isOpen, currentMinBPM, currentMaxBPM]);

  if (!isOpen) return null;

  const handleApply = () => {
    const min = minBPM ? parseInt(minBPM) : null;
    const max = maxBPM ? parseInt(maxBPM) : null;
    
    // Validate that min <= max if both are provided
    if (min !== null && max !== null && min > max) {
      alert('Minimum BPM cannot be greater than Maximum BPM');
      return;
    }
    
    onBPMRangeChange(min, max);
    onClose();
  };

  const handleClear = () => {
    setMinBPM('');
    setMaxBPM('');
    onBPMRangeChange(null, null);
    onClose();
  };

  const commonBPMRanges = [
    { name: 'Slow (60-90)', min: 60, max: 90 },
    { name: 'Moderate (90-120)', min: 90, max: 120 },
    { name: 'Dance (120-140)', min: 120, max: 140 },
    { name: 'Fast (140-180)', min: 140, max: 180 },
    { name: 'Very Fast (180+)', min: 180, max: 200 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-green-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Filter by BPM Range</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Current Filter Display */}
        <div className="mb-6 text-center">
          <p className="text-gray-400 mb-2">Current Filter:</p>
          <div className="text-lg font-semibold text-white">
            {currentMinBPM || currentMaxBPM ? (
              <>
                {currentMinBPM || '0'} - {currentMaxBPM || '∞'} BPM
              </>
            ) : (
              'No BPM filter applied'
            )}
          </div>
        </div>

        {/* BPM Range Inputs */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            BPM Range
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min BPM"
                value={minBPM}
                onChange={(e) => setMinBPM(e.target.value)}
                min="1"
                max="300"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <span className="text-gray-400">to</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max BPM"
                value={maxBPM}
                onChange={(e) => setMaxBPM(e.target.value)}
                min="1"
                max="300"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Preset BPM Ranges */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-1 gap-2">
            {commonBPMRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  setMinBPM(range.min.toString());
                  setMaxBPM(range.max.toString());
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-left"
              >
                <span className="font-medium">{range.name}</span>
                <span className="text-gray-400 ml-2">({range.min}-{range.max} BPM)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300 text-center">
            Enter minimum and/or maximum BPM values to filter tracks by tempo. Leave empty for no limit.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            Clear Filter
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPMFilter;