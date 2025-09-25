import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, FolderOpen, Upload, Music, Copy } from 'lucide-react';
import AddTrackDialog from './AddTrackDialog';

interface AddTrackDropdownProps {
  onImportFolder?: () => void;
  onAddTrack?: () => void;
  onTracksAdded?: (tracks: any[]) => void;
}

const AddTrackDropdown: React.FC<AddTrackDropdownProps> = ({ 
  onImportFolder, 
  onAddTrack,
  onTracksAdded 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'single' | 'multiple' | 'folder'>('single');
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSingleTrack = () => {
    setDialogMode('single');
    setShowDialog(true);
    setIsOpen(false);
  };

  const handleMultipleTracks = () => {
    setDialogMode('multiple');
    setShowDialog(true);
    setIsOpen(false);
  };

  const handleImportFolder = () => {
    setDialogMode('folder');
    setShowDialog(true);
    setIsOpen(false);
  };

  const handleTracksAdded = (tracks: any[]) => {
    onTracksAdded?.(tracks);
    setShowDialog(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative" ref={buttonRef}>
        <div className="flex bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg shadow-lg hover:shadow-xl">
          {/* Main Button */}
          <button
            onClick={handleSingleTrack}
            className="text-white px-6 py-3 font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-l-lg flex-1"
          >
            <Upload className="w-4 h-4" />
            <span>Add Track</span>
          </button>
          
          {/* Dropdown Arrow */}
          <button
            onClick={toggleDropdown}
            className="text-white px-3 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-r-lg border-l border-green-400/30"
          >
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <div className="py-1">
              <button
                onClick={handleSingleTrack}
                className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors duration-200 text-left"
              >
                <Music className="w-4 h-4 mr-3 text-green-400" />
                <div>
                  <div className="font-medium">Add Single Track</div>
                  <div className="text-sm text-gray-400">Upload individual music file</div>
                </div>
              </button>
              
              <button
                onClick={handleMultipleTracks}
                className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors duration-200 text-left"
              >
                <Copy className="w-4 h-4 mr-3 text-purple-400" />
                <div>
                  <div className="font-medium">Add Multiple Tracks</div>
                  <div className="text-sm text-gray-400">Upload multiple files at once</div>
                </div>
              </button>
              
              <hr className="border-gray-700" />
              
              <button
                onClick={handleImportFolder}
                className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors duration-200 text-left"
              >
                <FolderOpen className="w-4 h-4 mr-3 text-blue-400" />
                <div>
                  <div className="font-medium">Import Folder</div>
                  <div className="text-sm text-gray-400">Import multiple tracks from folder</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Track Dialog */}
      <AddTrackDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onTracksAdded={handleTracksAdded}
        mode={dialogMode}
      />
    </>
  );
};

export default AddTrackDropdown;