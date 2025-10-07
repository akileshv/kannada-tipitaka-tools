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