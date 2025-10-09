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
          // ✅ Use provided values OR defaults
          newRows[index].paliType = item.type || 'p';
          newRows[index].paliTypename = item.typename || 'paragraph';
        } else {
          newRows[index].kannadaText = item.text || '';
          newRows[index].kannadaTags = item.tags || [];
          // ✅ Use provided values OR defaults
          newRows[index].kannadaType = item.type || 'p';
          newRows[index].kannadaTypename = item.typename || 'paragraph';
        }
      } else {
        if (column === 'pali') {
          newRows.push({
            id: generateUniqueId(),
            paliText: item.text || '',
            kannadaText: '',
            paliTags: item.tags || [],
            kannadaTags: [],
            // ✅ Set defaults for new rows
            paliType: item.type || 'p',
            kannadaType: undefined,
            paliTypename: item.typename || 'paragraph',
            kannadaTypename: undefined,
          });
        } else {
          newRows.push({
            id: generateUniqueId(),
            paliText: '',
            kannadaText: item.text || '',
            paliTags: [],
            kannadaTags: item.tags || [],
            // ✅ Set defaults for new rows
            paliType: undefined,
            kannadaType: item.type || 'p',
            paliTypename: undefined,
            kannadaTypename: item.typename || 'paragraph',
          });
        }
      }
    });

    return newRows;
  } else if (fileName.endsWith('.txt')) {
    // ✅ For .txt uploads: remove empty lines and trim
    const lines = content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0); // ✅ Remove blanks on upload
  
    lines.forEach((line, index) => {
      if (index < newRows.length) {
        if (column === 'pali') {
          newRows[index].paliText = line;
          if (!newRows[index].paliType) newRows[index].paliType = 'p';
          if (!newRows[index].paliTypename) newRows[index].paliTypename = 'paragraph';
        } else {
          newRows[index].kannadaText = line;
          if (!newRows[index].kannadaType) newRows[index].kannadaType = 'p';
          if (!newRows[index].kannadaTypename) newRows[index].kannadaTypename = 'paragraph';
        }
      } else {
        newRows.push({
          id: generateUniqueId(),
          paliText: column === 'pali' ? line : '',
          kannadaText: column === 'kannada' ? line : '',
          paliTags: [],
          kannadaTags: [],
          paliType: column === 'pali' ? 'p' : undefined,
          kannadaType: column === 'kannada' ? 'p' : undefined,
          paliTypename: column === 'pali' ? 'paragraph' : undefined,
          kannadaTypename: column === 'kannada' ? 'paragraph' : undefined,
        });
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
    dataToExport = contentRows.map(row => ({
      id: row.id,
      text: row.paliText,
      ...(row.paliTags && row.paliTags.length > 0 && { tags: row.paliTags }),
      ...(row.paliType && { type: row.paliType }),
      ...(row.paliTypename && { typename: row.paliTypename }),
    }));
  } else {
    dataToExport = contentRows.map(row => ({
      id: row.id,
      text: row.kannadaText,
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