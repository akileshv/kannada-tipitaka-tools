"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import { Spin } from 'antd';
import type { ContentRow } from './types';

// Components
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ActionPanel } from './components/ActionPanel';
import { ContentDisplay } from './components/ContentDisplay';
import { Footer } from './components/Footer';
import { EditModal } from './components/modals/EditModal';
import { TagModal } from './components/modals/TagModal';
import { ClearModal } from './components/modals/ClearModal';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { useSelection } from './hooks/useSelection';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Utils
import { setupConsoleOverride } from './utils/consoleOverride';
import { parseFileContent, exportData, downloadJSON } from './utils/fileHandlers';
import { reconstructRows, splitRowText, toArrayFormat } from './utils/rowOperations';

// Styles
import './styles.css';

setupConsoleOverride();

const AppContent: React.FC = () => {
  const { message: messageApi, modal: modalApi } = AntApp.useApp();

  // State management
  const [contentRows, setContentRows] = useState<ContentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadSection, setShowUploadSection] = useState(true);

  // Custom hooks
  const {
    loadFromLocalStorage,
    saveToLocalStorage,
    clearLocalStorage,
  } = useLocalStorage(messageApi);

  const {
    history,
    historyIndex,
    setHistory,
    setHistoryIndex,
    addToHistory,
    handleUndo,
    handleRedo,
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
  const [editColumn, setEditColumn] = useState<'pali' | 'kannada'>('pali');
  const [editText, setEditText] = useState('');

  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tagItems, setTagItems] = useState<string[]>([]);
  const [typeInput, setTypeInput] = useState<string>('');
  const [typenameInput, setTypenameInput] = useState<string>('');
  const [currentTagColumn, setCurrentTagColumn] = useState<'pali' | 'kannada'>('pali');

  const [isClearModalVisible, setIsClearModalVisible] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const { contentRows: savedRows, history: savedHistory, historyIndex: savedIndex } = loadFromLocalStorage();
    setContentRows(savedRows);
    setHistory(savedHistory);
    setHistoryIndex(savedIndex);
    setIsLoading(false);
  }, [loadFromLocalStorage, setHistory, setHistoryIndex]);

  // Keyboard shortcuts
  const performUndo = useCallback(() => {
    const prevState = handleUndo();
    if (prevState) {
      setContentRows(prevState.contentRows);
      setSelectedPaliIds(new Set(prevState.selectedPaliIds));
      setSelectedKannadaIds(new Set(prevState.selectedKannadaIds));
      messageApi.info('Undo successful');
    }
  }, [handleUndo, messageApi, setSelectedPaliIds, setSelectedKannadaIds]);

  const performRedo = useCallback(() => {
    const nextState = handleRedo();
    if (nextState) {
      setContentRows(nextState.contentRows);
      setSelectedPaliIds(new Set(nextState.selectedPaliIds));
      setSelectedKannadaIds(new Set(nextState.selectedKannadaIds));
      messageApi.info('Redo successful');
    }
  }, [handleRedo, messageApi, setSelectedPaliIds, setSelectedKannadaIds]);

  useKeyboardShortcuts({
    onUndo: performUndo,
    onRedo: performRedo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  });

  // File upload handler
  const handleFileUpload = useCallback((file: File, column: 'pali' | 'kannada') => {
    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;

      try {
        const newRows = parseFileContent(content, fileName, column, contentRows);
        addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
        setContentRows(newRows);
        
        const dataType = fileName.endsWith('.json') ? 'JSON' : 'text';
        const count = fileName.endsWith('.json') 
          ? JSON.parse(content).length 
          : content.split('\n').filter(line => line.trim()).length;
          
        messageApi.success(
          `${column === 'pali' ? 'Pali' : 'Kannada'} ${dataType} imported successfully (${count} rows)!`
        );
      } catch (error: unknown) {
        console.error('Error processing file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
        messageApi.error(errorMessage);
      }
    };

    reader.onerror = () => messageApi.error('Error reading file');
    reader.readAsText(file);
    return false;
  }, [contentRows, addToHistory, selectedPaliIds, selectedKannadaIds, messageApi]);

  // Edit modal handlers
  const openEditModal = useCallback((row: ContentRow, column: 'pali' | 'kannada') => {
    setEditingRow(row);
    setEditColumn(column);
    setEditText(column === 'pali' ? row.paliText : row.kannadaText);
    setIsEditModalVisible(true);
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editingRow) return;

    const lines = editText.split('\n');

    if (lines.length === 1 && lines[0].trim() === '') {
      const newRows = contentRows.map(row => {
        if (row.id === editingRow.id) {
          const updatedRow = { ...row };
          if (editColumn === 'pali') {
            updatedRow.paliText = '';
            updatedRow.paliTags = [];
            updatedRow.paliType = undefined;
            updatedRow.paliTypename = undefined;
          } else {
            updatedRow.kannadaText = '';
            updatedRow.kannadaTags = [];
            updatedRow.kannadaType = undefined;
            updatedRow.kannadaTypename = undefined;
          }
          return updatedRow;
        }
        return row;
      });
      
      addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
      setContentRows(newRows);
      setIsEditModalVisible(false);
      messageApi.success(`${editColumn} content cleared!`);
      return;
    }

    if (lines.length === 1) {
      const newRows = contentRows.map(row => {
        if (row.id === editingRow.id) {
          const updatedRow = { ...row };
          if (editColumn === 'pali') {
            updatedRow.paliText = lines[0];
          } else {
            updatedRow.kannadaText = lines[0];
          }
          return updatedRow;
        }
        return row;
      });
      addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
      setContentRows(newRows);
    } else {
      const newRows = contentRows.filter(row => row.id !== editingRow.id);
      const editIndex = contentRows.findIndex(row => row.id === editingRow.id);
      const updatedRows = splitRowText(editingRow, editColumn, editText);
      newRows.splice(editIndex, 0, ...updatedRows);
      addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
      setContentRows(newRows);
    }

    setIsEditModalVisible(false);
    messageApi.success(`${editColumn} content updated successfully!`);
  }, [editingRow, editText, editColumn, contentRows, addToHistory, selectedPaliIds, selectedKannadaIds, messageApi]);

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
      id: targetArray[firstIndex]?.id,
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
    addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
    setContentRows(newRows);

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
        addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
        setContentRows(newRows);

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

  // Tag modal handlers - For action panel (multiple rows)
  const openTagModal = useCallback((column: 'pali' | 'kannada') => {
    setCurrentTagColumn(column);
    setTagItems([]);
    setTagInput('');
    setTypeInput('');
    setTypenameInput('');
    setIsTagModalVisible(true);
  }, []);

  // ✅ NEW: Open tag modal with pre-filled data for a specific row
  const openTagModalForRow = useCallback((row: ContentRow, column: 'pali' | 'kannada') => {
    setCurrentTagColumn(column);
    
    // Pre-fill with existing data
    if (column === 'pali') {
      setTagItems(row.paliTags || []);
      setTypeInput(row.paliType || '');
      setTypenameInput(row.paliTypename || '');
    } else {
      setTagItems(row.kannadaTags || []);
      setTypeInput(row.kannadaType || '');
      setTypenameInput(row.kannadaTypename || '');
    }
    
    // Auto-select this row
    if (column === 'pali') {
      setSelectedPaliIds(new Set([row.id]));
    } else {
      setSelectedKannadaIds(new Set([row.id]));
    }
    
    setTagInput('');
    setIsTagModalVisible(true);
  }, [setSelectedPaliIds, setSelectedKannadaIds]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tagItems.includes(tagInput.trim())) {
      setTagItems([...tagItems, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tagItems]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTagItems(tagItems.filter(tag => tag !== tagToRemove));
  }, [tagItems]);

  const handleAddTags = useCallback(() => {
    const selectedIds = currentTagColumn === 'pali' ? selectedPaliIds : selectedKannadaIds;

    if (selectedIds.size === 0) {
      messageApi.warning(`Please select ${currentTagColumn} rows to add tags to`);
      return;
    }

    const newRows = contentRows.map(row => {
      if (selectedIds.has(row.id)) {
        const updatedRow = { ...row };
        
        if (currentTagColumn === 'pali') {
          if (tagItems.length > 0) {
            const existingTags = row.paliTags || [];
            const uniqueTags = [...new Set([...existingTags, ...tagItems])];
            updatedRow.paliTags = uniqueTags;
          }
          if (typeInput) updatedRow.paliType = typeInput;
          if (typenameInput) updatedRow.paliTypename = typenameInput;
        } else {
          if (tagItems.length > 0) {
            const existingTags = row.kannadaTags || [];
            const uniqueTags = [...new Set([...existingTags, ...tagItems])];
            updatedRow.kannadaTags = uniqueTags;
          }
          if (typeInput) updatedRow.kannadaType = typeInput;
          if (typenameInput) updatedRow.kannadaTypename = typenameInput;
        }
        
        return updatedRow;
      }
      return row;
    });

    addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
    setContentRows(newRows);
    setIsTagModalVisible(false);
    setTagItems([]);
    setTagInput('');
    setTypeInput('');
    setTypenameInput('');
    messageApi.success(`Tags and types added to ${currentTagColumn} content successfully!`);
  }, [contentRows, selectedPaliIds, selectedKannadaIds, currentTagColumn, tagItems, typeInput, typenameInput, addToHistory, messageApi]);

  // Export handlers
  const handleExport = useCallback((exportType: 'both' | 'pali' | 'kannada') => {
    if (contentRows.length === 0) {
      messageApi.warning('No content to export');
      return;
    }

    const { data, count } = exportData(contentRows, exportType);

    if (count === 0) {
      messageApi.warning(`No ${exportType} content to export`);
      return;
    }

    downloadJSON(data, `bilingual-alignment-${exportType}`);
    messageApi.success(`${count} row(s) exported successfully!`);
  }, [contentRows, messageApi]);

  // Clear all data
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

  // Save to localStorage wrapper
  const handleSave = useCallback(() => {
    saveToLocalStorage(contentRows, history, historyIndex);
  }, [saveToLocalStorage, contentRows, history, historyIndex]);

  const hasPaliSelection = selectedPaliIds.size > 0;
  const hasKannadaSelection = selectedKannadaIds.size > 0;
  const taggedRowsCount = contentRows.filter(row => 
    (row.paliTags && row.paliTags.length > 0) || 
    (row.kannadaTags && row.kannadaTags.length > 0)
  ).length;

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#141414'
      }}>
        <Spin size="large">
          <div style={{ padding: '50px' }} />
        </Spin>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#0e0f13' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <Header />

        <UploadSection
          showUploadSection={showUploadSection}
          setShowUploadSection={setShowUploadSection}
          onFileUpload={handleFileUpload}
        />

        <ActionPanel
          hasPaliSelection={hasPaliSelection}
          hasKannadaSelection={hasKannadaSelection}
          selectedPaliCount={selectedPaliIds.size}
          selectedKannadaCount={selectedKannadaIds.size}
          onMergePali={() => handleMerge('pali')}
          onMergeKannada={() => handleMerge('kannada')}
          onDeletePaliContent={() => handleDeleteContent('pali')}
          onDeleteKannadaContent={() => handleDeleteContent('kannada')}
          onAddPaliTags={() => openTagModal('pali')}
          onAddKannadaTags={() => openTagModal('kannada')}
          onDeleteEntireRows={handleDeleteEntireRows}
          onClearPaliSelection={() => clearSelection('pali')}
          onClearKannadaSelection={() => clearSelection('kannada')}
        />

        <ContentDisplay
          contentRows={contentRows}
          selectedPaliIds={selectedPaliIds}
          selectedKannadaIds={selectedKannadaIds}
          onPaliCheckboxChange={(id) => handleCheckboxChange(id, 'pali')}
          onKannadaCheckboxChange={(id) => handleCheckboxChange(id, 'kannada')}
          onSelectAllPali={() => handleSelectAll('pali', contentRows)}
          onSelectAllKannada={() => handleSelectAll('kannada', contentRows)}
          onEditPali={(row) => openEditModal(row, 'pali')}
          onEditKannada={(row) => openEditModal(row, 'kannada')}
          onOpenPaliTagModal={(row) => openTagModalForRow(row, 'pali')}      // ✅ PASS THE FUNCTION
          onOpenKannadaTagModal={(row) => openTagModalForRow(row, 'kannada')} // ✅ PASS THE FUNCTION
          onSave={handleSave}
          onClear={() => setIsClearModalVisible(true)}
          onExportPali={() => handleExport('pali')}
          onExportKannada={() => handleExport('kannada')}
          onExportBoth={() => handleExport('both')}
          onUndo={performUndo}
          onRedo={performRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          historyIndex={historyIndex}
          historyLength={history.length}
        />

        <EditModal
          visible={isEditModalVisible}
          column={editColumn}
          text={editText}
          onTextChange={setEditText}
          onSave={handleEditSave}
          onCancel={() => setIsEditModalVisible(false)}
        />

        <TagModal
          visible={isTagModalVisible}
          column={currentTagColumn}
          tagInput={tagInput}
          tagItems={tagItems}
          typeInput={typeInput}
          typenameInput={typenameInput}
          onTagInputChange={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onTypeChange={setTypeInput}
          onTypenameChange={setTypenameInput}
          onApply={handleAddTags}
          onCancel={() => {
            setIsTagModalVisible(false);
            setTagItems([]);
            setTagInput('');
            setTypeInput('');
            setTypenameInput('');
          }}
        />

        <ClearModal
          visible={isClearModalVisible}
          contentRowsCount={contentRows.length}
          historyLength={history.length}
          onConfirm={handleClearAll}
          onCancel={() => setIsClearModalVisible(false)}
        />

        <Footer
          totalRows={contentRows.length}
          historyLength={history.length}
          taggedRowsCount={taggedRowsCount}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgBase: '#0e0f13',
          colorBgContainer: '#1a1c21',
          colorBorder: '#2a2d34',
          colorText: '#e0e3e7',
          colorTextSecondary: '#a0a3aa',
          colorPrimary: '#00b3a4',
          colorSuccess: '#30c48d',
          colorError: '#ff5c5c',
          colorWarning: '#f1a43c',
          colorInfo: '#37a2f2',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
        },
        components: {
          Card: {
            colorBgContainer: '#1a1c21',
            colorBorder: '#2a2d34',
          },
          Button: {
            colorPrimary: '#00b3a4',
            colorPrimaryHover: '#00c9b8',
            algorithm: true,
          },
          Input: {
            colorBgContainer: '#16181c',
            colorBorder: '#2a2d34',
          },
          Select: {
            colorBgContainer: '#16181c',
            colorBorder: '#2a2d34',
          },
          Modal: {
            colorBgElevated: '#1a1c21',
            headerBg: '#16181c',
          },
          Upload: {
            colorBgContainer: '#16181c',
            colorBorder: '#2a2d34',
          },
        },
      }}
    >
      <AntApp>
        <AppContent />
      </AntApp>
    </ConfigProvider>
  );
};

export default App;