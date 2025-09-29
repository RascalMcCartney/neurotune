export interface Folder {
  id: string;
  name: string;
  created_at: string;
  track_count: number;
  color?: string;
  parent_id?: string;
  children?: Folder[];
  expanded?: boolean;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: string;
  duration: string;
  bpm?: string;
  key?: string;
  energy?: number;
  danceability?: number;
  valence?: number;
  folder_id?: string;
  file_path?: string;
  created_at?: string;
  selected?: boolean;
  audioFile?: string;
  artwork?: string;
}

export interface TrackOperation {
  type: 'copy' | 'move' | 'delete' | 'duplicate';
  trackIds: string[];
  targetFolderId?: string | null;
}

export interface FolderContextMenuProps {
  folder: Folder;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string, folder: Folder) => void;
}

export interface TrackContextMenuProps {
  tracks: (Track & { selected: boolean })[];
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (operation: TrackOperation) => void;
}

export interface AudioFeaturesFilters {
  energy: { min: number; max: number } | null;
  danceability: { min: number; max: number } | null;
  valence: { min: number; max: number } | null;
}