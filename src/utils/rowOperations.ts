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
      // ✅ Use provided values OR defaults
      paliType: paliItem?.type || (paliItem?.text ? 'p' : undefined),
      kannadaType: kannadaItem?.type || (kannadaItem?.text ? 'p' : undefined),
      paliTypename: paliItem?.typename || (paliItem?.text ? 'paragraph' : undefined),
      kannadaTypename: kannadaItem?.typename || (kannadaItem?.text ? 'paragraph' : undefined),
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
      id: i === 0 ? row.id : generateUniqueId(),
      paliText: '',
      kannadaText: '',
    };
    
    if (column === 'pali') {
      newRow.paliText = lines[i];
      // ✅ ALL split rows inherit parent metadata
      newRow.paliTags = [...(row.paliTags || [])];
      newRow.paliType = row.paliType || 'p';
      newRow.paliTypename = row.paliTypename || 'paragraph';
      
      if (i === 0) {
        // First row keeps the other column's data
        newRow.kannadaText = row.kannadaText;
        newRow.kannadaTags = row.kannadaTags;
        newRow.kannadaType = row.kannadaType;
        newRow.kannadaTypename = row.kannadaTypename;
      }
    } else {
      newRow.kannadaText = lines[i];
      // ✅ ALL split rows inherit parent metadata
      newRow.kannadaTags = [...(row.kannadaTags || [])];
      newRow.kannadaType = row.kannadaType || 'p';
      newRow.kannadaTypename = row.kannadaTypename || 'paragraph';
      
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

// Add this function at the end of the file

export const removeTrailingEmptyRows = (contentRows: ContentRow[]): ContentRow[] => {
  if (contentRows.length === 0) return contentRows;
  
  let lastNonEmptyIndex = -1;
  
  // Find the last row that has actual content or typename "(empty)"
  for (let i = contentRows.length - 1; i >= 0; i--) {
    const row = contentRows[i];
    
    // Check if Pali has content or is intentionally empty
    const paliHasContent = row.paliText.trim() !== '' || 
                           (row.paliTags && row.paliTags.length > 0) ||
                           row.paliTypename === '(empty)';
    
    // Check if Kannada has content or is intentionally empty
    const kannadaHasContent = row.kannadaText.trim() !== '' || 
                              (row.kannadaTags && row.kannadaTags.length > 0) ||
                              row.kannadaTypename === '(empty)';
    
    // If either column has content, this is our last non-empty row
    if (paliHasContent || kannadaHasContent) {
      lastNonEmptyIndex = i;
      break;
    }
  }
  
  // Return rows up to and including the last non-empty row
  return contentRows.slice(0, lastNonEmptyIndex + 1);
};

export const toArrayFormat = (contentRows: ContentRow[]): { paliArray: ArrayEntry[], kannadaArray: ArrayEntry[] } => {
  const paliArray: ArrayEntry[] = [];
  const kannadaArray: ArrayEntry[] = [];

  contentRows.forEach((row) => {
    if (row.paliText || row.paliTags?.length || row.paliType || row.paliTypename) {
      paliArray.push({
        text: row.paliText,
        tags: row.paliTags,
        // ✅ Preserve existing or use defaults
        type: row.paliType || (row.paliText ? 'p' : undefined),
        typename: row.paliTypename || (row.paliText ? 'paragraph' : undefined),
      });
    } else {
      paliArray.push({ text: '' });
    }

    if (row.kannadaText || row.kannadaTags?.length || row.kannadaType || row.kannadaTypename) {
      kannadaArray.push({
        text: row.kannadaText,
        tags: row.kannadaTags,
        // ✅ Preserve existing or use defaults
        type: row.kannadaType || (row.kannadaText ? 'p' : undefined),
        typename: row.kannadaTypename || (row.kannadaText ? 'paragraph' : undefined),
      });
    } else {
      kannadaArray.push({ text: '' });
    }
  });

  return { paliArray, kannadaArray };
};