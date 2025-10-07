import type { ContentRow, ExportedSingleColumn } from '../types';

export const reconstructRows = (paliArray: ExportedSingleColumn[], kannadaArray: ExportedSingleColumn[]): ContentRow[] => {
  const maxLength = Math.max(paliArray.length, kannadaArray.length);
  const newRows: ContentRow[] = [];

  for (let i = 0; i < maxLength; i++) {
    const paliItem = paliArray[i] || null;
    const kannadaItem = kannadaArray[i] || null;

    newRows.push({
      id: `row-${Date.now()}-${i}-${Math.random()}`,
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

export const splitRowText = (
  row: ContentRow,
  column: 'pali' | 'kannada',
  newText: string
): ContentRow[] => {
  const lines = newText.split('\n');
  const updatedRows: ContentRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    const newRow: ContentRow = {
      id: i === 0 ? row.id : `${row.id}-split-${i}`,
      paliText: '',
      kannadaText: '',
    };
    
    if (column === 'pali') {
      newRow.paliText = lines[i];
      if (i === 0) {
        newRow.kannadaText = row.kannadaText;
        newRow.kannadaTags = row.kannadaTags;
        newRow.kannadaType = row.kannadaType;
        newRow.kannadaTypename = row.kannadaTypename;
      }
    } else {
      newRow.kannadaText = lines[i];
      if (i === 0) {
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

export const toArrayFormat = (contentRows: ContentRow[]): { paliArray: ExportedSingleColumn[], kannadaArray: ExportedSingleColumn[] } => {
  const paliArray: ExportedSingleColumn[] = [];
  const kannadaArray: ExportedSingleColumn[] = [];

  contentRows.forEach((row) => {
    if (row.paliText || row.paliTags?.length || row.paliType || row.paliTypename) {
      paliArray.push({
        id: row.id,
        text: row.paliText,
        tags: row.paliTags,
        type: row.paliType,
        typename: row.paliTypename,
      });
    } else {
      paliArray.push({ id: `row-${Date.now()}-${Math.random()}`, text: '' });
    }

    if (row.kannadaText || row.kannadaTags?.length || row.kannadaType || row.kannadaTypename) {
      kannadaArray.push({
        id: row.id,
        text: row.kannadaText,
        tags: row.kannadaTags,
        type: row.kannadaType,
        typename: row.kannadaTypename,
      });
    } else {
      kannadaArray.push({ id: `row-${Date.now()}-${Math.random()}`, text: '' });
    }
  });

  return { paliArray, kannadaArray };
};