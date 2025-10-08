import type { ContentRow } from '../types';

interface ArrayEntry {
  text: string;
  tags?: string[];
  type?: string;
  typename?: string;
}

export const reconstructRows = (
  paliArray: ArrayEntry[], 
  kannadaArray: ArrayEntry[], 
  originalRows?: ContentRow[]
):  ContentRow[] => {
  const maxLength = Math.max(paliArray.length, kannadaArray.length);
  const newRows: ContentRow[] = [];

  for (let i = 0; i < maxLength; i++) {
    const paliItem = paliArray[i];
    const kannadaItem = kannadaArray[i];

    // ✅ Try to preserve original ID if the row data matches
    let id: string;
    if (originalRows && i < originalRows.length) {
      const originalRow = originalRows[i];
      // Keep ID if at least one column's content matches
      const paliMatches = originalRow.paliText === (paliItem?.text || '');
      const kannadaMatches = originalRow.kannadaText === (kannadaItem?.text || '');
      
      if (paliMatches || kannadaMatches) {
        id = originalRow.id;
      } else {
        id = generateUniqueId();
      }
    } else {
      id = generateUniqueId();
    }

    newRows.push({
      id,
      paliText: paliItem?.text || '',
      kannadaText: kannadaItem?.text || '',
      paliTags: paliItem?.tags || [],
      kannadaTags: kannadaItem?.tags || [],
      paliType: paliItem?.type,
      kannadaType: kannadaItem?.type,
      paliTypename: paliItem?.typename,
      kannadaTypename: kannadaItem?.typename,
    });
  }

  return newRows;
};

// Generate truly unique ID
const generateUniqueId = (): string => {
  return `row-${Date.now()}-${Math.random().toString(36).substring(2, 11)}-${Math.random().toString(36).substring(2, 11)}`;
};

export const splitRowText = (
  row: ContentRow,
  column: 'pali' | 'kannada',
  newText: string
): ContentRow[] => {
  const lines = newText.split('\n');
  const updatedRows: ContentRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    const newRow: ContentRow = {
      // Generate completely unique ID for each split row
      id: i === 0 ? row.id : generateUniqueId(),
      paliText: '',
      kannadaText: '',
    };
    
    if (column === 'pali') {
      newRow.paliText = lines[i];
      if (i === 0) {
        // First row keeps the other column's data
        newRow.kannadaText = row.kannadaText;
        newRow.kannadaTags = row.kannadaTags;
        newRow.kannadaType = row.kannadaType;
        newRow.kannadaTypename = row.kannadaTypename;
      }
    } else {
      newRow.kannadaText = lines[i];
      if (i === 0) {
        // First row keeps the other column's data
        newRow.paliText = row.paliText;
        newRow.paliTags = row.paliTags;
        newRow.paliType = row.paliType;
        newRow.paliTypename = row.paliTypename;
      }
    }
    
    updatedRows.push(newRow);
  }

  return updatedRows;
};

export const toArrayFormat = (contentRows: ContentRow[]): { paliArray: ArrayEntry[], kannadaArray: ArrayEntry[] } => {
  const paliArray: ArrayEntry[] = [];
  const kannadaArray: ArrayEntry[] = [];

  contentRows.forEach((row) => {
    if (row.paliText || row.paliTags?.length || row.paliType || row.paliTypename) {
      paliArray.push({
        text: row.paliText,
        tags: row.paliTags,
        type: row.paliType,
        typename: row.paliTypename,
      });
    } else {
      paliArray.push({ text: '' });
    }

    if (row.kannadaText || row.kannadaTags?.length || row.kannadaType || row.kannadaTypename) {
      kannadaArray.push({
        text: row.kannadaText,
        tags: row.kannadaTags,
        type: row.kannadaType,
        typename: row.kannadaTypename,
      });
    } else {
      kannadaArray.push({ text: '' });
    }
  });

  return { paliArray, kannadaArray };
};