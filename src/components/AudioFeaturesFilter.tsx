import React, { useState, useEffect } from 'react';
import { Zap, X, RotateCcw } from 'lucide-react';

interface AudioFeaturesFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: {
    energy: { min: number; max: number } | null;
    danceability: { min: number; max: number } | null;
    valence: { min: number; max: number } | null;
  }) => void;
  currentFilters: {
    energy: { min: number; max: number } | null;
    danceability: { min: number; max: number } | null;
    valence: { min: number; max: number } | null;
  };
}

const AudioFeaturesFilter: React.FC<AudioFeaturesFilterProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  currentFilters
}) => {
  const [energyMin, setEnergyMin] = useState(0);
  const [energyMax, setEnergyMax] = useState(100);
  const [energyEnabled, setEnergyEnabled] = useState(false);
  
  const [danceabilityMin, setDanceabilityMin] = useState(0);
  const [danceabilityMax, setDanceabilityMax] = useState(100);
  const [danceabilityEnabled, setDanceabilityEnabled] = useState(false);
  
  const [valenceMin, setValenceMin] = useState(0);
  const [valenceMax, setValenceMax] = useState(100);
  const [valenceEnabled, setValenceEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initialize with current filter values
      if (currentFilters.energy) {
        setEnergyMin(currentFilters.energy.min);
        setEnergyMax(currentFilters.energy.max);
        setEnergyEnabled(true);
      } else {
        setEnergyMin(0);
        setEnergyMax(100);
        setEnergyEnabled(false);
      }

      if (currentFilters.danceability) {
        setDanceabilityMin(currentFilters.danceability.min);
        setDanceabilityMax(currentFilters.danceability.max);
        setDanceabilityEnabled(true);
      } else {
        setDanceabilityMin(0);
        setDanceabilityMax(100);
        setDanceabilityEnabled(false);
      }

      if (currentFilters.valence) {
        setValenceMin(currentFilters.valence.min);
        setValenceMax(currentFilters.valence.max);
        setValenceEnabled(true);
      } else {
        setValenceMin(0);
        setValenceMax(100);
        setValenceEnabled(false);
      }
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    const filters = {
      energy: energyEnabled ? { min: energyMin, max: energyMax } : null,
      danceability: danceabilityEnabled ? { min: danceabilityMin, max: danceabilityMax } : null,
      valence: valenceEnabled ? { min: valenceMin, max: valenceMax } : null
    };
    
    onFiltersChange(filters);
    onClose();
  };

  const handleClear = () => {
    setEnergyEnabled(false);
    setDanceabilityEnabled(false);
    setValenceEnabled(false);
    setEnergyMin(0);
    setEnergyMax(100);
    setDanceabilityMin(0);
    setDanceabilityMax(100);
    setValenceMin(0);
    setValenceMax(100);
    
    onFiltersChange({
      energy: null,
      danceability: null,
      valence: null
    });
    onClose();
  };

  const presets = [
    {
      name: 'High Energy',
      energy: { min: 70, max: 100 },
      danceability: { min: 60, max: 100 },
      valence: { min: 50, max: 100 }
    },
    {
      name: 'Chill & Relaxed',
      energy: { min: 0, max: 40 },
      danceability: { min: 0, max: 50 },
      valence: { min: 30, max: 80 }
    },
    {
      name: 'Upbeat & Happy',
      energy: { min: 60, max: 100 },
      danceability: { min: 70, max: 100 },
      valence: { min: 70, max: 100 }
    },
    {
      name: 'Melancholic',
      energy: { min: 0, max: 50 },
      danceability: { min: 0, max: 40 },
      valence: { min: 0, max: 30 }
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setEnergyMin(preset.energy.min);
    setEnergyMax(preset.energy.max);
    setEnergyEnabled(true);
    
    setDanceabilityMin(preset.danceability.min);
    setDanceabilityMax(preset.danceability.max);
    setDanceabilityEnabled(true);
    
    setValenceMin(preset.valence.min);
    setValenceMax(preset.valence.max);
    setValenceEnabled(true);
  };

  const RangeSlider = ({ 
    label, 
    min, 
    max, 
    minValue, 
    maxValue, 
    onMinChange, 
    onMaxChange, 
    enabled, 
    onEnabledChange,
    color,
    description
  }: {
    label: string;
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    color: string;
    description: string;
  }) => (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      enabled 
        ? `bg-${color}-900/20 border-${color}-700/50` 
        : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
              className={`w-4 h-4 text-${color}-600 bg-gray-700 border-gray-600 rounded focus:ring-${color}-500 focus:ring-offset-gray-800`}
            />
            <span className="text-lg font-medium text-white">{label}</span>
          </label>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      
      {enabled && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Min</label>
              <input
                type="number"
                min={min}
                max={max}
                value={minValue}
                onChange={(e) => onMinChange(Math.min(parseInt(e.target.value) || min, maxValue))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Max</label>
              <input
                type="number"
                min={min}
                max={max}
                value={maxValue}
                onChange={(e) => onMaxChange(Math.max(parseInt(e.target.value) || max, minValue))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{min}</span>
              <span>{max}</span>
            </div>
            
            <div className="relative h-6">
              <div className="absolute inset-0 bg-gray-700 rounded-full h-2 top-2"></div>
              <div 
                className={`absolute bg-${color}-500 rounded-full h-2 top-2`}
                style={{
                  left: `${(minValue / max) * 100}%`,
                  width: `${((maxValue - minValue) / max) * 100}%`
                }}
              ></div>
              
              <input
                type="range"
                min={min}
                max={max}
                value={minValue}
                onChange={(e) => onMinChange(Math.min(parseInt(e.target.value), maxValue))}
                className="absolute w-full h-6 opacity-0 cursor-pointer"
              />
              <input
                type="range"
                min={min}
                max={max}
                value={maxValue}
                onChange={(e) => onMaxChange(Math.max(parseInt(e.target.value), minValue))}
                className="absolute w-full h-6 opacity-0 cursor-pointer"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{minValue}</span>
              <span>{maxValue}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const activeFiltersCount = [energyEnabled, danceabilityEnabled, valenceEnabled].filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Zap className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-white">Audio Features Filter</h3>
              <p className="text-sm text-gray-400">
                Filter tracks by energy, danceability, and emotional valence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Current Filters Summary */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400 mb-2 text-sm">Active Filters:</p>
          {activeFiltersCount > 0 ? (
            <div className="space-y-1">
              {energyEnabled && (
                <span className="inline-block bg-yellow-600 text-white text-xs px-2 py-1 rounded mr-2">
                  Energy: {energyMin}-{energyMax}
                </span>
              )}
              {danceabilityEnabled && (
                <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded mr-2">
                  Danceability: {danceabilityMin}-{danceabilityMax}
                </span>
              )}
              {valenceEnabled && (
                <span className="inline-block bg-pink-600 text-white text-xs px-2 py-1 rounded mr-2">
                  Valence: {valenceMin}-{valenceMax}
                </span>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No audio feature filters applied</p>
          )}
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 text-left group border border-gray-700 hover:border-gray-600"
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  E: {preset.energy.min}-{preset.energy.max} • 
                  D: {preset.danceability.min}-{preset.danceability.max} • 
                  V: {preset.valence.min}-{preset.valence.max}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 mb-6">
          <RangeSlider
            label="Energy"
            min={0}
            max={100}
            minValue={energyMin}
            maxValue={energyMax}
            onMinChange={setEnergyMin}
            onMaxChange={setEnergyMax}
            enabled={energyEnabled}
            onEnabledChange={setEnergyEnabled}
            color="yellow"
            description="Track intensity and power level"
          />
          
          <RangeSlider
            label="Danceability"
            min={0}
            max={100}
            minValue={danceabilityMin}
            maxValue={danceabilityMax}
            onMinChange={setDanceabilityMin}
            onMaxChange={setDanceabilityMax}
            enabled={danceabilityEnabled}
            onEnabledChange={setDanceabilityEnabled}
            color="purple"
            description="How suitable the track is for dancing"
          />
          
          <RangeSlider
            label="Valence"
            min={0}
            max={100}
            minValue={valenceMin}
            maxValue={valenceMax}
            onMinChange={setValenceMin}
            onMaxChange={setValenceMax}
            enabled={valenceEnabled}
            onEnabledChange={setValenceEnabled}
            color="pink"
            description="Musical positivity and emotional tone"
          />
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-2">About Audio Features:</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li><strong>Energy:</strong> Intensity and power (0 = calm, 100 = intense)</li>
            <li><strong>Danceability:</strong> How suitable for dancing (0 = not danceable, 100 = very danceable)</li>
            <li><strong>Valence:</strong> Emotional positivity (0 = sad/negative, 100 = happy/positive)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleClear}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All Filters
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
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioFeaturesFilter;