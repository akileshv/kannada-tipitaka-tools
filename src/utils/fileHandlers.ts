import type { ContentRow, ExportedRow, ExportedSingleColumn } from '../types';

// Generate truly unique ID
const generateUniqueId = (): string => {
  return `row-${Date.now()}-${Math.random().toString(36).substring(2, 11)}-${Math.random().toString(36).substring(2, 11)}`;
};

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
            id: generateUniqueId(),
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
            id: generateUniqueId(),
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
          } else {
            newRows[index].kannadaText = line;
          }
        } else {
          newRows.push({
            id: generateUniqueId(),
            paliText: column === 'pali' ? line : '',
            kannadaText: column === 'kannada' ? line : '',
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
): { data: ExportedRow[] | ExportedSingleColumn[], count: number } => {
  let dataToExport;

  if (exportType === 'both') {
    // ✅ Don't filter - export ALL rows including empty ones
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
    // ✅ Export all rows, even if paliText is empty (might have metadata)
    dataToExport = contentRows.map(row => ({
      id: row.id,
      text: row.paliText, // Keep empty strings
      ...(row.paliTags && row.paliTags.length > 0 && { tags: row.paliTags }),
      ...(row.paliType && { type: row.paliType }),
      ...(row.paliTypename && { typename: row.paliTypename }),
    }));
  } else {
    // ✅ Export all rows, even if kannadaText is empty
    dataToExport = contentRows.map(row => ({
      id: row.id,
      text: row.kannadaText, // Keep empty strings
      ...(row.kannadaTags && row.kannadaTags.length > 0 && { tags: row.kannadaTags }),
      ...(row.kannadaType && { type: row.kannadaType }),
      ...(row.kannadaTypename && { typename: row.kannadaTypename }),
    }));
  }

  return { data: dataToExport, count: dataToExport.length };
};

export const downloadJSON = (data: ExportedRow[] | ExportedSingleColumn[], filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};