import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderPlus, 
  Edit3, 
  Trash2, 
  Music, 
  MoreVertical,
  Check,
  X,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Copy,
  Move,
  CheckSquare,
  Square,
  RotateCcw
} from 'lucide-react';
import type { Folder as FolderType, Track, TrackOperation } from '../types/folder';
import TrackContextMenu from './TrackContextMenu';
import FolderContextMenu from './FolderContextMenu';
import FolderSelector from './FolderSelector';

interface FolderManageProps {
  onFolderSelect?: (folderId: string | null) => void;
  selectedFolderId?: string | null;
  tracks?: Track[];
  onMoveTrack?: (trackId: string, folderId: string | null) => void;
  onTrackOperation?: (operation: TrackOperation) => void;
}

const FolderManage: React.FC<FolderManageProps> = ({ 
  onFolderSelect, 
  selectedFolderId, 
  tracks = [],
  onMoveTrack,
  onTrackOperation
}) => {
  const [folders, setFolders] = useState<FolderType[]>([
    { 
      id: '1', 
      name: 'Favorites', 
      created_at: '2024-01-01', 
      track_count: 12,
      color: 'bg-red-500',
      expanded: true
    },
    { 
      id: '2', 
      name: 'Workout', 
      created_at: '2024-01-02', 
      track_count: 8,
      color: 'bg-green-500',
      parent_id: '1',
      expanded: false
    },
    { 
      id: '3', 
      name: 'Chill Vibes', 
      created_at: '2024-01-03', 
      track_count: 15,
      color: 'bg-purple-500',
      expanded: true
    },
    { 
      id: '4', 
      name: 'High Intensity', 
      created_at: '2024-01-04', 
      track_count: 5,
      color: 'bg-orange-500',
      parent_id: '2'
    },
    { 
      id: '5', 
      name: 'Cardio', 
      created_at: '2024-01-05', 
      track_count: 3,
      color: 'bg-yellow-500',
      parent_id: '2',
      expanded: false
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    type: 'folder' | 'track';
    position: { x: number; y: number };
    data: any;
  } | null>(null);
  const [showFolderSelector, setShowFolderSelector] = useState<{
    show: boolean;
    operation: TrackOperation | null;
  }>({ show: false, operation: null });
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [showTrackSelection, setShowTrackSelection] = useState(false);

  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];

  // Build hierarchical folder structure
  const buildFolderTree = (folders: FolderType[]): FolderType[] => {
    const folderMap = new Map<string, FolderType>();
    const rootFolders: FolderType[] = [];

    // Create folder map with children arrays
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Build tree structure
    folderMap.forEach(folder => {
      if (folder.parent_id && folderMap.has(folder.parent_id)) {
        folderMap.get(folder.parent_id)!.children!.push(folder);
      } else {
        rootFolders.push(folder);
      }
    });

    return rootFolders;
  };

  const filterFolders = (folders: FolderType[], searchTerm: string): FolderType[] => {
    if (!searchTerm) return folders;
    
    return folders.filter(folder => 
      folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (folder.children && filterFolders(folder.children, searchTerm).length > 0)
    );
  };

  const folderTree = buildFolderTree(folders);
  const filteredFolders = filterFolders(folderTree, searchTerm);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderType = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        created_at: new Date().toISOString(),
        track_count: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        expanded: true
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const handleCreateSubfolder = (parentId: string) => {
    setIsCreating(true);
    setNewFolderName('');
    // Store parent ID for later use when creating
    (window as any).tempParentId = parentId;
  };

  const handleToggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, expanded: !folder.expanded }
        : folder
    ));
  };

  const handleRenameFolder = (id: string) => {
    if (editingName.trim()) {
      setFolders(folders.map(folder => 
        folder.id === id 
          ? { ...folder, name: editingName.trim() }
          : folder
      ));
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDeleteFolder = (id: string) => {
    // Delete folder and all its children
    const deleteFolder = (folderId: string) => {
      const folder = folders.find(f => f.id === folderId);
      if (folder && folder.children) {
        folder.children.forEach(child => deleteFolder(child.id));
      }
      return folders.filter(f => f.id !== folderId && f.parent_id !== folderId);
    };
    
    setFolders(deleteFolder(id));
    if (selectedFolderId === id) {
      onFolderSelect?.(null);
    }
    closeContextMenu();
  };

  const handleFolderAction = (action: string, folder: FolderType) => {
    switch (action) {
      case 'rename':
        startEditing(folder);
        break;
      case 'addSubfolder':
        handleCreateSubfolder(folder.id);
        break;
      case 'changeColor':
        changeColor(folder.id);
        break;
      case 'copy':
        duplicateFolder(folder.id);
        break;
      case 'expand':
      case 'collapse':
        handleToggleFolder(folder.id);
        break;
      case 'delete':
        handleDeleteFolder(folder.id);
        break;
    }
  };

  const startEditing = (folder: FolderType) => {
    setEditingId(folder.id);
    setEditingName(folder.name);
    closeContextMenu();
  };

  const changeColor = (folderId: string) => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, color: newColor }
        : folder
    ));
  };

  const duplicateFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      const newFolder: FolderType = {
        ...folder,
        id: Date.now().toString(),
        name: `${folder.name} (Copy)`,
        created_at: new Date().toISOString()
      };
      setFolders([...folders, newFolder]);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleTrackContextMenu = (e: React.MouseEvent, tracks: Track[]) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure at least one track is selected
    if (selectedTracks.size === 0 && tracks.length > 0) {
      setSelectedTracks(new Set([tracks[0].id]));
    }
    
    const selectedTrackList = tracks.filter(track => selectedTracks.has(track.id));
    
    setContextMenu({
      type: 'track',
      position: { x: e.clientX, y: e.clientY },
      data: selectedTrackList.length > 0 ? selectedTrackList : tracks
    });
  };

  const handleFolderContextMenu = (e: React.MouseEvent, folder: FolderType) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      type: 'folder',
      position: { x: e.clientX, y: e.clientY },
      data: folder
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleTrackOperation = (operation: TrackOperation) => {
    if (operation.type === 'delete') {
      // Handle delete immediately
      onTrackOperation?.(operation);
      setSelectedTracks(new Set());
    } else if (operation.type === 'duplicate') {
      // Handle duplicate immediately
      onTrackOperation?.(operation);
      setSelectedTracks(new Set());
    } else {
      // Show folder selector for copy/move operations
      setShowFolderSelector({ show: true, operation });
    }
  };

  const handleFolderSelection = (folderId: string | null) => {
    if (showFolderSelector.operation) {
      const operation = { ...showFolderSelector.operation, targetFolderId: folderId };
      onTrackOperation?.(operation);
      setSelectedTracks(new Set());
    }
    setShowFolderSelector({ show: false, operation: null });
  };

  const handleTrackSelect = (trackId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedTracks);
    if (isSelected) {
      newSelection.add(trackId);
    } else {
      newSelection.delete(trackId);
    }
    setSelectedTracks(newSelection);
  };

  const handleSelectAll = () => {
    const currentFolderTracks = tracks.filter(track => 
      selectedFolderId === null ? !track.folder_id : track.folder_id === selectedFolderId
    );
    const allSelected = currentFolderTracks.every(track => selectedTracks.has(track.id));
    
    if (allSelected) {
      setSelectedTracks(new Set());
    } else {
      setSelectedTracks(new Set(currentFolderTracks.map(track => track.id)));
    }
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = selectedFolderId === folder.id;
    const isExpanded = folder.expanded;

    return (
      <div key={folder.id}>
        <div
          className={`relative group rounded-lg transition-all duration-200 ${
            isSelected
              ? 'bg-gradient-to-r from-deep-blue-600 via-ocean-blue-700 to-deep-blue-800 border-2 border-gold-400/50 shadow-lg'
              : 'hover:bg-white/50 border-2 border-transparent'
          }`}
          style={{ marginLeft: `${level * 16}px` }}
        >
          {editingId === folder.id ? (
            <div className="flex items-center p-3">
              <div className="flex items-center mr-3">
                {hasChildren && (
                  <div className="w-4 h-4 mr-1" />
                )}
                <div className={`w-3 h-3 ${folder.color} rounded`}></div>
              </div>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                className="flex-1 bg-transparent outline-none font-medium text-gray-800 border-b border-gray-400 focus:border-ocean-blue-500"
                autoFocus
              />
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={() => handleRenameFolder(folder.id)}
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={() => onFolderSelect?.(folder.id)}
                onContextMenu={(e) => handleFolderContextMenu(e, folder)}
                className="flex items-center p-3 text-left flex-1"
              >
                <div className="flex items-center mr-3">
                  {hasChildren && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFolder(folder.id);
                      }}
                      className="p-1 hover:bg-blue-200/50 rounded mr-1 transition-colors duration-200"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                      )}
                    </button>
                  )}
                  <div className={`w-3 h-3 ${folder.color} rounded`}></div>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isSelected ? 'text-white' : 'text-gray-800'
                  }`}>{folder.name}</p>
                  <p className={`text-sm ${
                    isSelected ? 'text-blue-200' : 'text-gray-600'
                  }`}>{folder.track_count} tracks</p>
                </div>
                <Music className={`w-4 h-4 ${
                  isSelected ? 'text-gold-400' : 'text-gray-500 group-hover:text-ocean-blue-600'
                }`} />
              </button>
            </div>
          )}
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {folder.children!.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      closeContextMenu();
    };
    
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Get tracks for current folder
  const currentFolderTracks = tracks.filter(track => 
    selectedFolderId === null ? !track.folder_id : track.folder_id === selectedFolderId
  );

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200/50 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Folder className="w-6 h-6 text-ocean-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Folders</h2>
          </div>
          <div className="flex items-center space-x-2">
            {selectedTracks.size > 0 && (
              <button
                onClick={() => setSelectedTracks(new Set())}
                className="p-2 text-gray-600 hover:text-ocean-blue-700 hover:bg-blue-200/50 rounded-lg transition-colors duration-200"
                title="Clear selection"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowTrackSelection(!showTrackSelection)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showTrackSelection
                  ? 'bg-ocean-blue-600 text-white'
                  : 'text-gray-600 hover:text-ocean-blue-700 hover:bg-blue-200/50'
              }`}
              title="Toggle track selection mode"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isCreating
                  ? 'bg-ocean-blue-600 text-white'
                  : 'text-gray-600 hover:text-ocean-blue-700 hover:bg-blue-200/50'
              }`}
              title="Create new folder"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-blue-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Folder List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* All Tracks Option */}
        <div className="p-4">
          <button
            onClick={() => onFolderSelect?.(null)}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
              selectedFolderId === null
                ? 'bg-gradient-to-r from-deep-blue-600 via-ocean-blue-700 to-deep-blue-800 border-2 border-gold-400/50 shadow-lg'
                : 'hover:bg-white/50 border-2 border-transparent'
            }`}
          >
            <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded mr-3"></div>
            <div className="flex-1 text-left">
              <p className={`font-medium ${
                selectedFolderId === null ? 'text-white' : 'text-gray-800'
              }`}>All Tracks</p>
              <p className={`text-sm ${
                selectedFolderId === null ? 'text-blue-200' : 'text-gray-600'
              }`}>{tracks.length} tracks</p>
            </div>
            <Music className={`w-4 h-4 ${
              selectedFolderId === null ? 'text-gold-400' : 'text-gray-500 group-hover:text-ocean-blue-600'
            }`} />
          </button>
        </div>

        {/* Create New Folder Form */}
        {isCreating && (
          <div className="px-4 pb-4">
            <div className="flex items-center p-3 bg-white/70 rounded-lg border-2 border-ocean-blue-500">
              <div className="w-3 h-3 bg-ocean-blue-500 rounded mr-3"></div>
              <input
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="flex-1 bg-transparent outline-none font-medium text-gray-800 placeholder-gray-500"
                autoFocus
                onBlur={() => {
                  if (!newFolderName.trim()) {
                    setIsCreating(false);
                  }
                }}
              />
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={handleCreateFolder}
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewFolderName('');
                  }}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Folder Tree */}
        <div className="px-4 space-y-2">
          {filteredFolders.map(folder => renderFolder(folder))}
        </div>

        {filteredFolders.length === 0 && searchTerm && (
          <div className="px-4 py-8 text-center">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No folders found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Track List for Selected Folder */}
      {showTrackSelection && currentFolderTracks.length > 0 && (
        <div className="border-t border-blue-200/50 bg-white/30">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-800">
                Tracks in {selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : 'Root'}
              </h3>
              <button
                onClick={handleSelectAll}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {currentFolderTracks.every(track => selectedTracks.has(track.id)) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {currentFolderTracks.map(track => (
                <div
                  key={track.id}
                  className="flex items-center p-2 hover:bg-white/50 rounded-lg cursor-pointer"
                  onClick={() => handleTrackSelect(track.id, !selectedTracks.has(track.id))}
                  onContextMenu={(e) => handleTrackContextMenu(e, [track])}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrackSelect(track.id, !selectedTracks.has(track.id));
                    }}
                    className="mr-3"
                  >
                    {selectedTracks.has(track.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{track.name}</p>
                    <p className="text-xs text-gray-600 truncate">{track.artist}</p>
                  </div>
                  <p className="text-xs text-gray-600">{track.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="p-4 border-t border-blue-200/50 bg-white/30">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{folders.length} folders</span>
          <div className="flex items-center space-x-4">
            {selectedTracks.size > 0 && (
              <span className="text-blue-400">{selectedTracks.size} selected</span>
            )}
            <span>{tracks.length} total tracks</span>
          </div>
        </div>
      </div>
      </div>

      {/* Context Menus */}
      {contextMenu && contextMenu.type === 'folder' && (
        <FolderContextMenu
          folder={contextMenu.data}
          position={contextMenu.position}
          onClose={closeContextMenu}
          onAction={handleFolderAction}
        />
      )}

      {contextMenu && contextMenu.type === 'track' && (
        <TrackContextMenu
          tracks={contextMenu.data.map((track: any) => ({ ...track, selected: selectedTracks.has(track.id) }))}
          position={contextMenu.position}
          onClose={closeContextMenu}
          onAction={handleTrackOperation}
        />
      )}

      {/* Folder Selector Modal */}
      <FolderSelector
        isOpen={showFolderSelector.show}
        onClose={() => setShowFolderSelector({ show: false, operation: null })}
        folders={folders}
        onFolderSelect={handleFolderSelection}
        title={
          showFolderSelector.operation?.type === 'copy' 
            ? 'Copy Tracks to Folder' 
            : 'Move Tracks to Folder'
        }
      />
    </>
  );
};

export default FolderManage;