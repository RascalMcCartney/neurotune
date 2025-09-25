import React, { useState } from 'react';
import { Folder, ChevronRight, X, Check } from 'lucide-react';
import { Folder as FolderType } from '../types/folder';

interface FolderSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderType[];
  onFolderSelect: (folderId: string | null) => void;
  title: string;
  excludeFolderId?: string;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({
  isOpen,
  onClose,
  folders,
  onFolderSelect,
  title,
  excludeFolderId
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const buildFolderTree = (folders: FolderType[]): FolderType[] => {
    const folderMap = new Map<string, FolderType>();
    const rootFolders: FolderType[] = [];

    // Filter out excluded folder and its descendants
    const filteredFolders = folders.filter(folder => {
      if (excludeFolderId && (folder.id === excludeFolderId || isDescendantOf(folder, excludeFolderId, folders))) {
        return false;
      }
      return true;
    });

    // Create folder map
    filteredFolders.forEach(folder => {
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

  const isDescendantOf = (folder: FolderType, ancestorId: string, allFolders: FolderType[]): boolean => {
    if (!folder.parent_id) return false;
    if (folder.parent_id === ancestorId) return true;
    
    const parent = allFolders.find(f => f.id === folder.parent_id);
    return parent ? isDescendantOf(parent, ancestorId, allFolders) : false;
  };

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id}>
        <div
          className="flex items-center py-2 px-3 hover:bg-gray-700 rounded-lg cursor-pointer"
          style={{ paddingLeft: `${level * 20 + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(folder.id)}
              className="p-1 hover:bg-gray-600 rounded mr-2"
            >
              <ChevronRight
                className={`w-3 h-3 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
          
          <button
            onClick={() => onFolderSelect(folder.id)}
            className="flex items-center flex-1 text-left"
          >
            <div className={`w-3 h-3 ${folder.color || 'bg-gray-500'} rounded mr-3`} />
            <span className="text-white font-medium">{folder.name}</span>
            <span className="text-gray-400 text-sm ml-2">({folder.track_count})</span>
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {folder.children!.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const folderTree = buildFolderTree(folders);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full mx-4 border border-gray-700 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Folder className="w-6 h-6 text-blue-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Folder Tree */}
        <div className="flex-1 overflow-y-auto mb-6">
          {/* Root Level Option */}
          <div className="mb-4">
            <button
              onClick={() => onFolderSelect(null)}
              className="w-full flex items-center py-2 px-3 hover:bg-gray-700 rounded-lg text-left"
            >
              <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded mr-3" />
              <span className="text-white font-medium">Root (No Folder)</span>
            </button>
          </div>

          {/* Folder Tree */}
          <div className="space-y-1">
            {folderTree.map(folder => renderFolder(folder))}
          </div>

          {folderTree.length === 0 && (
            <div className="text-center py-8">
              <Folder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No folders available</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderSelector;