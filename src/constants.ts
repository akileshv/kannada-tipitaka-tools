export const STORAGE_KEY = 'bilingual-alignment-data';
export const HISTORY_KEY = 'bilingual-alignment-history';
export const HISTORY_INDEX_KEY = 'bilingual-alignment-history-index';
export const MAX_HISTORY = 50;

export const TYPE_STYLES: Record<string, React.CSSProperties> = {
  h1: { fontSize: '24px', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  h2: { fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  h3: { fontSize: '18px', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  h4: { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  h5: { fontSize: '14px', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  h6: { fontSize: '13px', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  p: { fontSize: '14px', margin: 0, lineHeight: 1.6 },
  title: { fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: 1.4 },
  subtitle: { fontSize: '16px', fontWeight: '500', margin: 0, lineHeight: 1.4 },
  paragraph: { fontSize: '14px', margin: 0, lineHeight: 1.6 },
  stanza: { fontSize: '14px', fontStyle: 'italic', margin: 0, lineHeight: 1.6 },
  blockquote: { 
    fontSize: '14px', 
    fontStyle: 'italic', 
    margin: 0, 
    lineHeight: 1.6, 
    paddingLeft: '12px', 
    borderLeft: '3px solid #434343' 
  },
  commentary: { fontSize: '13px', color: '#8c8c8c', margin: 0, lineHeight: 1.6 },
  footnote: { fontSize: '12px', color: '#8c8c8c', margin: 0, lineHeight: 1.5 },
};

export const ELEMENT_MAP: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  blockquote: 'blockquote',
  title: 'h2',
  subtitle: 'h3',
};