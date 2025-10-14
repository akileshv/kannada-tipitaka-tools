export interface ContentRow {
    id: string;
    paliText: string;
    kannadaText: string;
    paliTags?: string[];
    kannadaTags?: string[];
    paliType?: string;
    kannadaType?: string;
    paliTypename?: string;
    kannadaTypename?: string;
  }
  
  export interface HistoryState {
    contentRows: ContentRow[];
    selectedPaliIds: string[];
    selectedKannadaIds: string[];
  }
  
  export interface ExportedRow {
    id: string;
    paliText?: string;
    kannadaText?: string;
    paliTags?: string[];
    kannadaTags?: string[];
    paliType?: string;
    kannadaType?: string;
    paliTypename?: string;
    kannadaTypename?: string;
  }
  
  export interface ExportedSingleColumn {
    id: string;
    text: string;
    tags?: string[];
    type?: string;
    typename?: string;
  }

  export interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string | string[]>;
  }
  
  export interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
    id?: string;
    startIn?: FileSystemHandle | string; // Using 'string' as a fallback if WellKnownDirectory is not directly available
  }
  
  export interface WindowWithFSA extends Window {
    showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }