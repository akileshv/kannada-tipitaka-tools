import type { ContentRow, ExportedSingleColumn } from '../types';

export const parseFileContent = (
    content: string,
    fileName: string,
    column: 'pali' | 'kannada',
    existingRows: ContentRow[]
  ): ContentRow[] => {
    const newRows = [...existingRows];
  
    if (fileName.endsWith('.json')) {
      const jsonData = JSON.parse(content);
  
      if (!Array.isArray(jsonData)) {
        throw new Error('Invalid JSON format. Expected an array.');
      }
  
      if (jsonData.length === 0) {
        throw new Error('JSON file is empty.');
      }
  
      jsonData.forEach((item: ExportedSingleColumn, index) => {
        if (index < newRows.length) {
          if (column === 'pali') {
            newRows[index].paliText = item.text || '';
            newRows[index].paliTags = item.tags || [];
            newRows[index].paliType = item.type;
            newRows[index].paliTypename = item.typename;
          } else {
            newRows[index].kannadaText = item.text || '';
            newRows[index].kannadaTags = item.tags || [];
            newRows[index].kannadaType = item.type;
            newRows[index].kannadaTypename = item.typename;
          }
        } else {
          if (column === 'pali') {
            newRows.push({
              id: `row-${Date.now()}-${index}-${Math.random()}`,
              paliText: item.text || '',
              kannadaText: '',
              paliTags: item.tags || [],
              kannadaTags: [],
              paliType: item.type,
              kannadaType: undefined,
              paliTypename: item.typename,
              kannadaTypename: undefined,
            });
          } else {
            newRows.push({
              id: `row-${Date.now()}-${index}-${Math.random()}`,
              paliText: '',
              kannadaText: item.text || '',
              paliTags: [],
              kannadaTags: item.tags || [],
              paliType: undefined,
              kannadaType: item.type,
              paliTypename: undefined,
              kannadaTypename: item.typename,
            });
          }
        }
      });
  
      return newRows;
    } else if (fileName.endsWith('.txt')) {
      const lines = content.split('\n').filter(line => line.trim() !== '');
  
      lines.forEach((line, index) => {
        if (line.trim()) {
          if (index < newRows.length) {
            if (column === 'pali') {
              newRows[index].paliText = line;
              // ✅ CLEAR ALL PALI METADATA when uploading plain text
              newRows[index].paliTags = [];
              newRows[index].paliType = undefined;
              newRows[index].paliTypename = undefined;
            } else {
              newRows[index].kannadaText = line;
              // ✅ CLEAR ALL KANNADA METADATA when uploading plain text
              newRows[index].kannadaTags = [];
              newRows[index].kannadaType = undefined;
              newRows[index].kannadaTypename = undefined;
            }
          } else {
            newRows.push({
              id: `row-${Date.now()}-${index}`,
              paliText: column === 'pali' ? line : '',
              kannadaText: column === 'kannada' ? line : '',
              paliTags: [],
              kannadaTags: [],
              paliType: undefined,
              kannadaType: undefined,
              paliTypename: undefined,
              kannadaTypename: undefined,
            });
          }
        }
      });
  
      return newRows;
    }
  
    throw new Error('Unsupported file type');
  };

export const exportData = (
  contentRows: ContentRow[],
  exportType: 'both' | 'pali' | 'kannada'
): { data: unknown[], count: number } => {
  let dataToExport;

  if (exportType === 'both') {
    dataToExport = contentRows.map(row => ({
      id: row.id,
      paliText: row.paliText,
      kannadaText: row.kannadaText,
      ...(row.paliTags && row.paliTags.length > 0 && { paliTags: row.paliTags }),
      ...(row.kannadaTags && row.kannadaTags.length > 0 && { kannadaTags: row.kannadaTags }),
      ...(row.paliType && { paliType: row.paliType }),
      ...(row.kannadaType && { kannadaType: row.kannadaType }),
      ...(row.paliTypename && { paliTypename: row.paliTypename }),
      ...(row.kannadaTypename && { kannadaTypename: row.kannadaTypename }),
    }));
  } else if (exportType === 'pali') {
    dataToExport = contentRows
      .filter(row => row.paliText.trim())
      .map(row => ({
        id: row.id,
        text: row.paliText,
        ...(row.paliTags && row.paliTags.length > 0 && { tags: row.paliTags }),
        ...(row.paliType && { type: row.paliType }),
        ...(row.paliTypename && { typename: row.paliTypename }),
      }));
  } else {
    dataToExport = contentRows
      .filter(row => row.kannadaText.trim())
      .map(row => ({
        id: row.id,
        text: row.kannadaText,
        ...(row.kannadaTags && row.kannadaTags.length > 0 && { tags: row.kannadaTags }),
        ...(row.kannadaType && { type: row.kannadaType }),
        ...(row.kannadaTypename && { typename: row.kannadaTypename }),
      }));
  }

  return { data: dataToExport, count: dataToExport.length };
};

export const downloadJSON = (data: unknown[], filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};