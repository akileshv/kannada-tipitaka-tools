export const STORAGE_KEY = 'bilingual-alignment-data';
export const HISTORY_KEY = 'bilingual-alignment-history';
export const HISTORY_INDEX_KEY = 'bilingual-alignment-history-index';
export const MAX_HISTORY = 50;

export const TYPE_STYLES: Record<string, React.CSSProperties> = {
  h1: { fontSize: '18px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  h2: { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  h3: { fontSize: '15px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  h4: { fontSize: '14px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  h5: { fontSize: '13px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  h6: { fontSize: '12px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  p: { fontSize: '13px', margin: 0, lineHeight: 1.3 },
  title: { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  subtitle: { fontSize: '14px', fontWeight: '500', margin: 0, lineHeight: 1.2 },
  paragraph: { fontSize: '13px', margin: 0, lineHeight: 1.3 },
  stanza: { fontSize: '13px', fontStyle: 'italic', margin: 0, lineHeight: 1.3 },
  '(empty)': { fontSize: '12px', fontStyle: 'italic', margin: 0, lineHeight: 1.3, color: '#666' },
  'vagga': { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  'nikaya': { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  'sutta': { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  'namo-tasa': { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  'samyutta': { fontSize: '16px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  'sub-vagga': { fontSize: '15px', fontWeight: 'bold', margin: 0, lineHeight: 1.2 },
  blockquote: { 
    fontSize: '13px', 
    fontStyle: 'italic', 
    margin: 0, 
    lineHeight: 1.3, 
    paddingLeft: '8px', 
    borderLeft: '2px solid #434343' 
  },
  commentary: { fontSize: '12px', color: '#8c8c8c', margin: 0, lineHeight: 1.3 },
  footnote: { fontSize: '11px', color: '#8c8c8c', margin: 0, lineHeight: 1.3 },
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