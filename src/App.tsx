"use client";
import path from 'path';
import React, { useState, useEffect, useCallback } from 'react';
import { App as AntApp } from 'antd';
import type { ContentRow } from './types';
import { setupConsoleOverride } from './utils/consoleOverride';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { useSelection } from './hooks/useSelection';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { parseFileContent, exportData, downloadJSON } from './utils/fileHandlers';
import { toArrayFormat, reconstructRows, removeTrailingEmptyRows } from './utils/rowOperations';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ActionPanel } from './components/ActionPanel';
import { ContentDisplay } from './components/ContentDisplay';
import { Footer } from './components/Footer';
import { EditModal } from './components/modals/EditModal';
import { TagModal } from './components/modals/TagModal';
import { ClearModal } from './components/modals/ClearModal';
import { AppProviders } from './components/AppProviders';
import { ErrorBoundary } from './components/ErrorBoundary'; 
import './styles.css';
import { FontSizeProvider } from './contexts/FontSizeContext';

setupConsoleOverride();

const AppContent: React.FC = () => {
  const { message: messageApi, modal: modalApi } = AntApp.useApp();

  // State management
const [contentRows, setContentRows] = useState<ContentRow[]>([]);
const [showUploadSection, setShowUploadSection] = useState(true);
const [isFullViewMode, setIsFullViewMode] = useState(false);
const [fontSize, setFontSize] = useState<number>(100);

  // Custom hooks
  const { loadFromLocalStorage, saveToLocalStorage, clearLocalStorage } = useLocalStorage(messageApi);
  const {
    history,
    historyIndex,
    setHistory,
    setHistoryIndex,
    addToHistory,
    handleUndo: performUndo,
    handleRedo: performRedo,
  } = useHistory();

  const {
    selectedPaliIds,
    selectedKannadaIds,
    setSelectedPaliIds,
    setSelectedKannadaIds,
    handleSelectAll,
    handleCheckboxChange,
    clearSelection,
  } = useSelection();

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState<ContentRow | null>(null);
  const [quickEditRow, setQuickEditRow] = useState<ContentRow | null>(null);
  const [quickEditColumn, setQuickEditColumn] = useState<'pali' | 'kannada'>('pali');
  const [kannadaFileName, setKannadaFileName] = useState<string>('');
  const [paliFileName, setPaliFileName] = useState<string>('');

  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [currentTagColumn, setCurrentTagColumn] = useState<'pali' | 'kannada'>('pali');

  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  // Load from localStorage on mount
useEffect(() => {
  const { contentRows: savedRows, history: savedHistory, historyIndex: savedIndex } = loadFromLocalStorage();
  setContentRows(savedRows);
  setHistory(savedHistory);
  setHistoryIndex(savedIndex);
  
  // ✅ Load font size preference
  const savedFontSize = localStorage.getItem('font-size-preference');
  if (savedFontSize) {
    setFontSize(parseInt(savedFontSize, 10));
  }
}, [loadFromLocalStorage, setHistory, setHistoryIndex]);;

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const prevState = performUndo();
    if (prevState) {
      setContentRows(prevState.contentRows);
      setSelectedPaliIds(new Set(prevState.selectedPaliIds));
      setSelectedKannadaIds(new Set(prevState.selectedKannadaIds));
      messageApi.info('Undo successful');
    }
  }, [performUndo, messageApi, setSelectedPaliIds, setSelectedKannadaIds]);

  const handleRedo = useCallback(() => {
    const nextState = performRedo();
    if (nextState) {
      setContentRows(nextState.contentRows);
      setSelectedPaliIds(new Set(nextState.selectedPaliIds));
      setSelectedKannadaIds(new Set(nextState.selectedKannadaIds));
      messageApi.info('Redo successful');
    }
  }, [performRedo, messageApi, setSelectedPaliIds, setSelectedKannadaIds]);

  const handleQuickEditPali = useCallback((row: ContentRow) => {
    // Select the row
    setSelectedPaliIds(new Set([row.id]));
    // Set quick edit data
    setQuickEditRow(row);
    setQuickEditColumn('pali');
    // Open tag modal
    setIsTagModalVisible(true);
  }, [setSelectedPaliIds]);

  const handleQuickEditKannada = useCallback((row: ContentRow) => {
    // Select the row
    setSelectedKannadaIds(new Set([row.id]));
    // Set quick edit data
    setQuickEditRow(row);
    setQuickEditColumn('kannada');
    // Open tag modal
    setIsTagModalVisible(true);
  }, [setSelectedKannadaIds]);

  // ✅ UPDATE: Close tag modal handler
  const handleCloseTagModal = useCallback(() => {
    setIsTagModalVisible(false);
    setQuickEditRow(null);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((file: File, column: 'pali' | 'kannada') => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        try {

          if (file.size > MAX_FILE_SIZE) {
            messageApi.error('File too large. Maximum size is 10MB.');
            return false;
          }
          const newRows = parseFileContent(content, file.name, column, contentRows);
          addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
          setContentRows(newRows);
          const nameWithoutExt = path.parse(file.name).name;
          if (column === 'pali') setPaliFileName(nameWithoutExt);
          else setKannadaFileName(nameWithoutExt);
          
          const fileType = file.name.endsWith('.json') ? 'JSON' : 'text';
          const rowCount = file.name.endsWith('.json') 
            ? JSON.parse(content).length 
            : content.split('\n').filter(l => l.trim()).length;
          
          messageApi.success(
            `${column === 'pali' ? 'Pali' : 'Kannada'} ${fileType} imported successfully (${rowCount} rows)!`
          );
        } catch (error: unknown) {
          messageApi.error(error instanceof Error ? error.message : 'Failed to process file');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
      messageApi.error(errorMessage);
    }
    return false;
  }, [contentRows, selectedPaliIds, selectedKannadaIds, addToHistory, messageApi]);

  // Edit modal handlers
  const openEditModal = useCallback((row: ContentRow) => {
    setEditingRow(row);
    setIsEditModalVisible(true);
  }, []);

  const handleNavigateRow = useCallback((rowId: string) => {
    const row = contentRows.find(r => r.id === rowId);
    if (row) {
      setEditingRow(row);
    }
  }, [contentRows]);

  const handleEditSave = useCallback((
    rowId: string,
    column: 'pali' | 'kannada',
    newText: string,
    otherColumnText: string,
    otherColumnRowId: string
  ) => {
    const row = contentRows.find(r => r.id === rowId);
    if (!row) {
      messageApi.error('Row not found');
      return;
    }
  
    const lines = newText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  
    const otherColumnRow = contentRows.find(r => r.id === otherColumnRowId);
  
    const otherColumnOriginalText = otherColumnRow 
      ? (column === 'pali' ? otherColumnRow.kannadaText : otherColumnRow.paliText)
      : '';
    const otherColumnWasEdited = otherColumnText !== otherColumnOriginalText;
  
    const { paliArray, kannadaArray } = toArrayFormat(contentRows);
    const targetIndex = contentRows.findIndex(r => r.id === rowId);
    
    if (targetIndex === -1) {
      messageApi.error('Target row not found');
      return;
    }
  
    const targetArray = column === 'pali' ? paliArray : kannadaArray;
    const otherArray = column === 'pali' ? kannadaArray : paliArray;
    const originalEntry = targetArray[targetIndex];
  
    targetArray.splice(targetIndex, 1);
    const newEntries = lines.map((line) => ({
      text: line,
      tags: originalEntry?.tags || [],
      type: originalEntry?.type || 'p',
      typename: originalEntry?.typename || 'paragraph',
    }));
    targetArray.splice(targetIndex, 0, ...newEntries);
  
    if (otherColumnWasEdited) {
      const otherColumnRowIndex = contentRows.findIndex(r => r.id === otherColumnRowId);
      
      if (otherColumnRowIndex !== -1) {
        const otherColumnLines = otherColumnText
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n');
        
        const otherColumnOriginalEntry = otherArray[otherColumnRowIndex];
        
        otherArray.splice(otherColumnRowIndex, 1);
        
        const otherNewEntries = otherColumnLines.map((line) => ({
          text: line,
          tags: otherColumnOriginalEntry?.tags || [],
          type: otherColumnOriginalEntry?.type || 'p',
          typename: otherColumnOriginalEntry?.typename || 'paragraph',
        }));
        
        otherArray.splice(otherColumnRowIndex, 0, ...otherNewEntries);
      }
    }
  
    let newRows = reconstructRows(paliArray, kannadaArray, contentRows);
    
    // ✅ Remove trailing empty rows after edit
    newRows = removeTrailingEmptyRows(newRows);
    
    addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
    setContentRows(newRows);
    
    messageApi.success(`Content saved successfully!`, 3);
    
    if (newRows[targetIndex]) {
      setEditingRow(newRows[targetIndex]);
    }
  }, [contentRows, selectedPaliIds, selectedKannadaIds, addToHistory, messageApi, setEditingRow]);

  // ✅ ADD THESE TWO FUNCTIONS TO APP.TSX
  const handleMergePali = useCallback((currentIndex: number, direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= contentRows.length) {
      messageApi.warning('Cannot merge: no adjacent row');
      return;
    }
  
    const currentRow = contentRows[currentIndex];
    const targetRow = contentRows[targetIndex];
  
    if (!currentRow || !targetRow) return;
  
    // ✅ Use array format to merge only Pali column
    const { paliArray, kannadaArray } = toArrayFormat(contentRows);
  
    // Merge Pali texts with space
    const mergedText = direction === 'prev'
      ? `${paliArray[targetIndex]?.text || ''} ${paliArray[currentIndex]?.text || ''}`.trim()
      : `${paliArray[currentIndex]?.text || ''} ${paliArray[targetIndex]?.text || ''}`.trim();
  
    // Merge Pali tags
    const mergedTags = [
      ...new Set([
        ...(paliArray[currentIndex]?.tags || []),
        ...(paliArray[targetIndex]?.tags || [])
      ])
    ];
  
    // ✅ Modify only paliArray, keep kannadaArray unchanged
    if (direction === 'prev') {
      // Merge into previous, delete current
      paliArray[targetIndex] = {
        ...paliArray[targetIndex],
        text: mergedText,
        tags: mergedTags,
      };
      paliArray.splice(currentIndex, 1);
    } else {
      // Merge into current, delete next
      paliArray[currentIndex] = {
        ...paliArray[currentIndex],
        text: mergedText,
        tags: mergedTags,
      };
      paliArray.splice(targetIndex, 1);
    }
  
    // ✅ Reconstruct rows - kannadaArray stays intact!
    const newRows = reconstructRows(paliArray, kannadaArray, contentRows);
    const cleanedRows = removeTrailingEmptyRows(newRows); // ✅ Add this line
    addToHistory(cleanedRows, selectedPaliIds, selectedKannadaIds); // ✅ Use cleanedRows
    setContentRows(cleanedRows); // ✅ Use cleanedRows
    messageApi.success(`Pali rows merged successfully!`);
    
    const mergedRowIndex = direction === 'prev' ? targetIndex : currentIndex;
    if (newRows[mergedRowIndex]) {
      setEditingRow(newRows[mergedRowIndex]);
    }
  }, [contentRows, selectedPaliIds, selectedKannadaIds, addToHistory, messageApi, setEditingRow]);
  
  const handleMergeKannada = useCallback((currentIndex: number, direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= contentRows.length) {
      messageApi.warning('Cannot merge: no adjacent row');
      return;
    }
  
    const currentRow = contentRows[currentIndex];
    const targetRow = contentRows[targetIndex];
  
    if (!currentRow || !targetRow) return;
  
    // ✅ Use array format to merge only Kannada column
    const { paliArray, kannadaArray } = toArrayFormat(contentRows);
  
    // Merge Kannada texts with space
    const mergedText = direction === 'prev'
      ? `${kannadaArray[targetIndex]?.text || ''} ${kannadaArray[currentIndex]?.text || ''}`.trim()
      : `${kannadaArray[currentIndex]?.text || ''} ${kannadaArray[targetIndex]?.text || ''}`.trim();
  
    // Merge Kannada tags
    const mergedTags = [
      ...new Set([
        ...(kannadaArray[currentIndex]?.tags || []),
        ...(kannadaArray[targetIndex]?.tags || [])
      ])
    ];
  
    // ✅ Modify only kannadaArray, keep paliArray unchanged
    if (direction === 'prev') {
      // Merge into previous, delete current
      kannadaArray[targetIndex] = {
        ...kannadaArray[targetIndex],
        text: mergedText,
        tags: mergedTags,
      };
      kannadaArray.splice(currentIndex, 1);
    } else {
      // Merge into current, delete next
      kannadaArray[currentIndex] = {
        ...kannadaArray[currentIndex],
        text: mergedText,
        tags: mergedTags,
      };
      kannadaArray.splice(targetIndex, 1);
    }
  
    // ✅ Reconstruct rows - paliArray stays intact!
    const newRows = reconstructRows(paliArray, kannadaArray, contentRows);
    const cleanedRows = removeTrailingEmptyRows(newRows); // ✅ Add this line
    addToHistory(cleanedRows, selectedPaliIds, selectedKannadaIds); // ✅ Use cleanedRows
    setContentRows(cleanedRows);
    messageApi.success(`Kannada rows merged successfully!`);
    
    const mergedRowIndex = direction === 'prev' ? targetIndex : currentIndex;
    if (newRows[mergedRowIndex]) {
      setEditingRow(newRows[mergedRowIndex]);
    }
  }, [contentRows, selectedPaliIds, selectedKannadaIds, addToHistory, messageApi, setEditingRow]);

  // Merge handler
  const handleMerge = useCallback((column: 'pali' | 'kannada') => {
    const selectedIds = column === 'pali' ? selectedPaliIds : selectedKannadaIds;
    if (selectedIds.size < 2) {
      messageApi.warning(`Please select at least 2 ${column} rows to merge`);
      return;
    }

    const { paliArray, kannadaArray } = toArrayFormat(contentRows);

    const selectedIndices = Array.from(selectedIds)
      .map(id => contentRows.findIndex(row => row.id === id))
      .filter(index => index !== -1)
      .sort((a, b) => a - b);

    if (selectedIndices.length < 2) return;

    const firstIndex = selectedIndices[0];
    const targetArray = column === 'pali' ? paliArray : kannadaArray;

    const mergedText = selectedIndices
      .map(index => targetArray[index]?.text || '')
      .filter(text => text.trim())
      .join(' ');

    const allTags = selectedIndices.reduce((acc, index) => {
      const tags = targetArray[index]?.tags || [];
      acc.push(...tags);
      return acc;
    }, [] as string[]);
    const uniqueTags = [...new Set(allTags)];

    const mergedEntry = {
      text: mergedText,
      tags: uniqueTags,
      type: targetArray[firstIndex]?.type,
      typename: targetArray[firstIndex]?.typename,
    };

    selectedIndices.reverse().forEach(index => {
      targetArray.splice(index, 1);
    });

    targetArray.splice(firstIndex, 0, mergedEntry);

    const newRows = reconstructRows(paliArray, kannadaArray);
    const cleanedRows = removeTrailingEmptyRows(newRows); // ✅ Add this line
    addToHistory(cleanedRows, selectedPaliIds, selectedKannadaIds);
    setContentRows(cleanedRows);

    if (column === 'pali') {
      setSelectedPaliIds(new Set());
    } else {
      setSelectedKannadaIds(new Set());
    }

    messageApi.success(`${column} rows merged successfully!`);
  }, [contentRows, selectedPaliIds, selectedKannadaIds, addToHistory, messageApi, setSelectedPaliIds, setSelectedKannadaIds]);

  // Delete content handler
  const handleDeleteContent = useCallback((column: 'pali' | 'kannada') => {
    const selectedIds = column === 'pali' ? selectedPaliIds : selectedKannadaIds;
    if (selectedIds.size === 0) {
      messageApi.warning(`Please select ${column} rows to delete content from`);
      return;
    }

    modalApi.confirm({
      title: `Delete ${column === 'pali' ? 'Pali' : 'Kannada'} Content`,
      content: `Are you sure you want to delete ${column} content from ${selectedIds.size} row(s)?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const { paliArray, kannadaArray } = toArrayFormat(contentRows);

        const selectedIndices = Array.from(selectedIds)
          .map(id => contentRows.findIndex(row => row.id === id))
          .filter(index => index !== -1)
          .sort((a, b) => b - a);

        if (column === 'pali') {
          selectedIndices.forEach(index => {
            paliArray.splice(index, 1);
          });
        } else {
          selectedIndices.forEach(index => {
            kannadaArray.splice(index, 1);
          });
        }

        const newRows = reconstructRows(paliArray, kannadaArray);
        const cleanedRows = removeTrailingEmptyRows(newRows); // ✅ Add this line
        addToHistory(cleanedRows, selectedPaliIds, selectedKannadaIds);
        setContentRows(cleanedRows);

        if (column === 'pali') {
          setSelectedPaliIds(new Set());
        } else {
          setSelectedKannadaIds(new Set());
        }

        messageApi.success(`${column} content deleted successfully!`);
      }
    });
  }, [contentRows, selectedPaliIds, selectedKannadaIds, addToHistory, messageApi, modalApi, setSelectedPaliIds, setSelectedKannadaIds]);

  // Delete entire rows handler
  const handleDeleteEntireRows = useCallback(() => {
    const idsToDelete = new Set([...selectedPaliIds, ...selectedKannadaIds]);
    if (idsToDelete.size === 0) {
      messageApi.warning('Please select rows to delete');
      return;
    }

    modalApi.confirm({
      title: 'Delete Entire Rows',
      content: `Are you sure you want to permanently delete ${idsToDelete.size} row(s)?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const newRows = contentRows.filter(row => !idsToDelete.has(row.id));
        addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
        setContentRows(newRows);
        setSelectedPaliIds(new Set());
        setSelectedKannadaIds(new Set());
        messageApi.success(`${idsToDelete.size} row(s) deleted successfully!`);
      }
    });
  }, [contentRows, selectedPaliIds, selectedKannadaIds, addToHistory, messageApi, modalApi, setSelectedPaliIds, setSelectedKannadaIds]);
  
  // Export handler
  const handleExport = useCallback((exportType: 'both' | 'pali' | 'kannada') => {
    if (contentRows.length === 0) {
      messageApi.warning('No content to export');
      return;
    }
    
    // ✅ Use the new function
    const cleanedRows = removeTrailingEmptyRows(contentRows);
    const { data, count } = exportData(cleanedRows, exportType);
  
    if (count === 0) {
      messageApi.warning(`No ${exportType} content to export`);
      return;
    }
    console.log(exportType === 'pali' ? paliFileName : kannadaFileName);
    downloadJSON(data, exportType === 'pali' ? paliFileName : kannadaFileName);
    messageApi.success(`${count} row(s) exported successfully!`);
  }, [contentRows, messageApi, paliFileName, kannadaFileName]);

  // Clear all handler
  const handleClearAll = useCallback(() => {
    clearLocalStorage();
    setContentRows([]);
    setHistory([]);
    setHistoryIndex(-1);
    setSelectedPaliIds(new Set());
    setSelectedKannadaIds(new Set());
    setIsClearModalVisible(false);
    messageApi.success('All data cleared successfully!');
  }, [clearLocalStorage, setHistory, setHistoryIndex, setSelectedPaliIds, setSelectedKannadaIds, messageApi]);

  // Font size handler
const handleFontSizeChange = useCallback((newSize: number) => {
  setFontSize(newSize);
  localStorage.setItem('font-size-preference', newSize.toString());
}, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    // ✅ Add new shortcuts
    onSave: () => saveToLocalStorage(contentRows, history, historyIndex),
    onMergePali: () => handleMerge('pali'),
    onMergeKannada: () => handleMerge('kannada'),
    onDeletePaliContent: () => handleDeleteContent('pali'),
    onDeleteKannadaContent: () => handleDeleteContent('kannada'),
    onToggleFullView: () => setIsFullViewMode(!isFullViewMode),
    onDeleteEntireRows: handleDeleteEntireRows,
    onAddPaliTags: () => {
      setCurrentTagColumn('pali');
      setIsTagModalVisible(true);
    },
    onAddKannadaTags: () => {
      setCurrentTagColumn('kannada');
      setIsTagModalVisible(true);
    },
    onExportPali: () => handleExport('pali'),
    onExportKannada: () => handleExport('kannada'),
    onExportBoth: () => handleExport('both'),
    onClearAll: () => setIsClearModalVisible(true),
    onClearPaliSelection: () => clearSelection('pali'),
    onClearKannadaSelection: () => clearSelection('kannada'),
    hasPaliSelection: selectedPaliIds.size > 0,
    hasKannadaSelection: selectedKannadaIds.size > 0,
  });


  return (
    <div style={{ 
      padding: isFullViewMode ? '8px' : '24px', 
      height: isFullViewMode ? '100vh' : 'auto',
      minHeight: '100vh', 
      backgroundColor: '#0e0f13',
      transition: 'padding 0.3s ease',
      display: isFullViewMode ? 'flex' : 'block',
      flexDirection: 'column',
      overflow: isFullViewMode ? 'hidden' : 'visible'
    }}>
      <FontSizeProvider fontSize={fontSize}>
      <div style={{ 
        maxWidth: isFullViewMode ? '100%' : '1600px', 
        width: '100%',
        margin: '0 auto',
        transition: 'max-width 0.3s ease',
        flex: isFullViewMode ? 1 : 'none',
        display: isFullViewMode ? 'flex' : 'block',
        flexDirection: 'column',
        overflow: isFullViewMode ? 'hidden' : 'visible'
      }}>
        <Header 
  isFullViewMode={isFullViewMode}
  onToggleFullView={() => setIsFullViewMode(!isFullViewMode)}
  fontSize={fontSize}
  onFontSizeChange={handleFontSizeChange}
/>

        {!isFullViewMode && (
          <UploadSection
            showUploadSection={showUploadSection}
            setShowUploadSection={setShowUploadSection}
            onFileUpload={handleFileUpload}
          />
        )}

        {!isFullViewMode && (
  <ActionPanel
    hasPaliSelection={selectedPaliIds.size > 0}
    hasKannadaSelection={selectedKannadaIds.size > 0}
    selectedPaliCount={selectedPaliIds.size}
    selectedKannadaCount={selectedKannadaIds.size}
    onMergePali={() => handleMerge('pali')}
    onMergeKannada={() => handleMerge('kannada')}
    onDeletePaliContent={() => handleDeleteContent('pali')}
    onDeleteKannadaContent={() => handleDeleteContent('kannada')}
    onAddPaliTags={() => {
      setCurrentTagColumn('pali');
      setIsTagModalVisible(true);
    }}
    onAddKannadaTags={() => {
      setCurrentTagColumn('kannada');
      setIsTagModalVisible(true);
    }}
    onDeleteEntireRows={handleDeleteEntireRows}
    onClearPaliSelection={() => clearSelection('pali')}
    onClearKannadaSelection={() => clearSelection('kannada')}
  />
)}

        <div style={{ 
          flex: isFullViewMode ? 1 : 'none',
          display: isFullViewMode ? 'flex' : 'block',
          flexDirection: 'column',
          overflow: isFullViewMode ? 'hidden' : 'visible',
          minHeight: 0
        }}>
          <ContentDisplay
  contentRows={contentRows}
  selectedPaliIds={selectedPaliIds}
  selectedKannadaIds={selectedKannadaIds}
  onSelectAll={(column) => handleSelectAll(column, contentRows)}
  onCheckboxChange={handleCheckboxChange}
  onEdit={openEditModal}
  onQuickEditPali={handleQuickEditPali}
  onQuickEditKannada={handleQuickEditKannada}
  onSave={() => saveToLocalStorage(contentRows, history, historyIndex)}
  onExport={handleExport}
  onUndo={handleUndo}
  onRedo={handleRedo}
  onClearAll={() => setIsClearModalVisible(true)}
  canUndo={historyIndex > 0}
  canRedo={historyIndex < history.length - 1}
  historyCount={history.length}
  isFullViewMode={isFullViewMode}
  fontSize={fontSize} // ✅ ADD THIS
/>
        </div>

        {!isFullViewMode && (
          <Footer contentRows={contentRows} historyCount={history.length} />
        )}

        {/* Modals */}
        <EditModal
          visible={isEditModalVisible}
          editingRow={editingRow}
          allRows={contentRows}
          onClose={() => setIsEditModalVisible(false)}
          onSavePali={(rowId, text, otherColumnText, otherColumnRowId) => 
            handleEditSave(rowId, 'pali', text, otherColumnText, otherColumnRowId)
          }
          onSaveKannada={(rowId, text, otherColumnText, otherColumnRowId) => 
            handleEditSave(rowId, 'kannada', text, otherColumnText, otherColumnRowId)
          }
          onNavigate={handleNavigateRow}
          onMergePali={handleMergePali}
          onMergeKannada={handleMergeKannada}
        />

        <TagModal
          visible={isTagModalVisible}
          column={currentTagColumn}
          selectedIds={currentTagColumn === 'pali' ? selectedPaliIds : selectedKannadaIds}
          existingTags={
            quickEditRow
              ? (currentTagColumn === 'pali' ? quickEditRow.paliTags : quickEditRow.kannadaTags)
              : []
          }
          existingType={
            quickEditRow
              ? (currentTagColumn === 'pali' ? quickEditRow.paliType : quickEditRow.kannadaType)
              : ''
          }
          existingTypename={
            quickEditRow
              ? (currentTagColumn === 'pali' ? quickEditRow.paliTypename : quickEditRow.kannadaTypename)
              : ''
          }
          onClose={handleCloseTagModal}
          onApply={(tags, type, typename) => {
            const selectedIds = currentTagColumn === 'pali' ? selectedPaliIds : selectedKannadaIds;
            
            const newRows = contentRows.map(row => {
              if (selectedIds.has(row.id)) {
                const updatedRow = { ...row };
                
                if (currentTagColumn === 'pali') {
                  if (tags.length > 0) {
                    const existingTags = row.paliTags || [];
                    updatedRow.paliTags = [...new Set([...existingTags, ...tags])];
                  }
                  if (type) updatedRow.paliType = type;
                  if (typename) updatedRow.paliTypename = typename;
                } else {
                  if (tags.length > 0) {
                    const existingTags = row.kannadaTags || [];
                    updatedRow.kannadaTags = [...new Set([...existingTags, ...tags])];
                  }
                  if (type) updatedRow.kannadaType = type;
                  if (typename) updatedRow.kannadaTypename = typename;
                }
                
                return updatedRow;
              }
              return row;
            });

            addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
            setContentRows(newRows);
            setIsTagModalVisible(false);
            setQuickEditRow(null);
            messageApi.success(`Tags and types updated successfully!`);
          }}
        />

        <ClearModal
          visible={isClearModalVisible}
          rowCount={contentRows.length}
          historyCount={history.length}
          onConfirm={handleClearAll}
          onCancel={() => setIsClearModalVisible(false)}
        />
      </div>
      </FontSizeProvider>
    </div>
  );
};

export default function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProviders>
  );
}