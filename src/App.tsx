"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { App as AntApp } from 'antd';
import type { ContentRow } from './types';
import { setupConsoleOverride } from './utils/consoleOverride';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { useSelection } from './hooks/useSelection';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { parseFileContent, exportData, downloadJSON } from './utils/fileHandlers';
import { toArrayFormat, reconstructRows } from './utils/rowOperations';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ActionPanel } from './components/ActionPanel';
import { ContentDisplay } from './components/ContentDisplay';
import { Footer } from './components/Footer';
import { EditModal } from './components/modals/EditModal';
import { TagModal } from './components/modals/TagModal';
import { ClearModal } from './components/modals/ClearModal';
import { AppProviders } from './components/AppProviders';
import './styles.css';

setupConsoleOverride();

const AppContent: React.FC = () => {
  const { message: messageApi, modal: modalApi } = AntApp.useApp();

  // State management
  const [contentRows, setContentRows] = useState<ContentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadSection, setShowUploadSection] = useState(true);

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

  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  });

  // File upload handler
  const handleFileUpload = useCallback((file: File, column: 'pali' | 'kannada') => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const newRows = parseFileContent(content, file.name, column, contentRows);
          addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
          setContentRows(newRows);
          
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
  
    const lines = newText.split('\n');
    const otherColumnRow = contentRows.find(r => r.id === otherColumnRowId);
  
    // Check if other column was edited
    const otherColumnOriginalText = otherColumnRow 
      ? (column === 'pali' ? otherColumnRow.kannadaText : otherColumnRow.paliText)
      : '';
    const otherColumnWasEdited = otherColumnText !== otherColumnOriginalText;
  
    console.log('🔍 Save Debug:', {
      column,
      rowId,
      otherColumnRowId,
      sameRow: rowId === otherColumnRowId,
      lineCount: lines.length,
      otherColumnWasEdited,
      otherColumnHasNewlines: otherColumnText.includes('\n'),
    });
  
    // ✅ CASE 1: Empty content - clear the row
    if (newText.trim() === '') {
      const newRows = contentRows.map(r => {
        if (r.id === rowId) {
          const updatedRow = { ...r };
          if (column === 'pali') {
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
        if (otherColumnWasEdited && r.id === otherColumnRowId) {
          const updatedRow = { ...r };
          if (column === 'pali') {
            updatedRow.kannadaText = otherColumnText;
          } else {
            updatedRow.paliText = otherColumnText;
          }
          return updatedRow;
        }
        return r;
      });
      
      addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
      setContentRows(newRows);
      messageApi.success(`${column} content cleared!`);
      
      const updatedRow = newRows.find(r => r.id === rowId);
      if (updatedRow) setEditingRow(updatedRow);
      return;
    }
  
    // ✅ CASE 2: Single line (no newlines) - simple update
    if (lines.length === 1 && !otherColumnText.includes('\n')) {
      const newRows = contentRows.map(r => {
        if (r.id === rowId) {
          const updatedRow = { ...r };
          if (column === 'pali') {
            updatedRow.paliText = lines[0];
          } else {
            updatedRow.kannadaText = lines[0];
          }
          return updatedRow;
        }
        if (otherColumnWasEdited && r.id === otherColumnRowId) {
          const updatedRow = { ...r };
          if (column === 'pali') {
            updatedRow.kannadaText = otherColumnText;
          } else {
            updatedRow.paliText = otherColumnText;
          }
          return updatedRow;
        }
        return r;
      });
      
      addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
      setContentRows(newRows);
      
      const message = otherColumnWasEdited 
        ? `Both columns saved successfully!`
        : `${column} content updated!`;
      messageApi.success(message);
      
      const updatedRow = newRows.find(r => r.id === rowId);
      if (updatedRow) setEditingRow(updatedRow);
      return;
    }
  
    // ✅ CASE 3: Multiple lines OR other column has newlines - SPLIT LOGIC
    console.log('🔪 Splitting logic - processing both columns');
    
    const { paliArray, kannadaArray } = toArrayFormat(contentRows);
    const targetIndex = contentRows.findIndex(r => r.id === rowId);
    
    if (targetIndex === -1) {
      messageApi.error('Target row not found');
      return;
    }
  
    const targetArray = column === 'pali' ? paliArray : kannadaArray;
    const otherArray = column === 'pali' ? kannadaArray : paliArray;
    const originalEntry = targetArray[targetIndex];
  
    console.log('📍 Target index:', targetIndex);
  
    // ✅ Process the main column (split if needed)
    targetArray.splice(targetIndex, 1);
    const newEntries = lines.map((line, i) => ({
      text: line,
      tags: originalEntry?.tags || [],
      type: i === 0 ? originalEntry?.type : undefined,
      typename: i === 0 ? originalEntry?.typename : undefined,
    }));
    targetArray.splice(targetIndex, 0, ...newEntries);
  
    console.log('✅ Main column split into', newEntries.length, 'entries');
  
    // ✅ Process the OTHER column if edited
    if (otherColumnWasEdited) {
      const otherColumnRowIndex = contentRows.findIndex(r => r.id === otherColumnRowId);
      
      if (otherColumnRowIndex === -1) {
        console.warn('⚠️ Other column row not found');
      } else {
        const otherColumnLines = otherColumnText.split('\n');
        const otherColumnOriginalEntry = otherArray[otherColumnRowIndex];
        
        // ✅ If other column also has newlines, split it too!
        if (otherColumnLines.length > 1) {
          console.log('🔪 Other column also has newlines, splitting it too');
          
          // Remove original entry
          otherArray.splice(otherColumnRowIndex, 1);
          
          // Create new entries for other column
          const otherNewEntries = otherColumnLines.map((line, i) => ({
            text: line,
            tags: otherColumnOriginalEntry?.tags || [],
            type: i === 0 ? otherColumnOriginalEntry?.type : undefined,
            typename: i === 0 ? otherColumnOriginalEntry?.typename : undefined,
          }));
          
          // Insert at the same index
          otherArray.splice(otherColumnRowIndex, 0, ...otherNewEntries);
          
          console.log('✅ Other column split into', otherNewEntries.length, 'entries');
        } else {
          // Single line - just update
          console.log('📝 Other column is single line, updating');
          if (otherArray[otherColumnRowIndex]) {
            otherArray[otherColumnRowIndex].text = otherColumnText;
          }
        }
      }
    }
  
    console.log('🔄 Reconstructing rows...');
    console.log('Pali array length:', paliArray.length);
    console.log('Kannada array length:', kannadaArray.length);
  
    // Reconstruct with ID preservation
    const newRows = reconstructRows(paliArray, kannadaArray, contentRows);
    
    console.log('✅ New rows count:', newRows.length);
    
    addToHistory(newRows, selectedPaliIds, selectedKannadaIds);
    setContentRows(newRows);
    
    // Success message
    let message = `${column} content split into ${lines.length} lines!`;
    if (otherColumnWasEdited) {
      const otherColumnName = column === 'pali' ? 'Kannada' : 'Pali';
      const otherColumnLines = otherColumnText.split('\n');
      if (otherColumnLines.length > 1) {
        message = `Both columns split! ${column}: ${lines.length} lines, ${otherColumnName}: ${otherColumnLines.length} lines`;
      } else {
        message += ` ${otherColumnName} also saved.`;
      }
    }
    
    messageApi.success(message, 5);
    
    // Update editing row to the first split row
    if (newRows[targetIndex]) {
      setEditingRow(newRows[targetIndex]);
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

  const isRowEmpty = ({ 
    kannadaTags = [], kannadaText = "", kannadaType = "", kannadaTypename = "", paliTags = [], paliText = "", paliType = "", paliTypename = "",
  }: ContentRow) => {

    if (kannadaTags.length === 0 && kannadaText === "" && kannadaType === "" && kannadaTypename === "" &&
      paliTags.length === 0 && paliText === "" && paliType === "" && paliTypename === "") {
        console.log("------", true, "----------")
      } else {
        console.log("------", false, "----------", kannadaTags.length, kannadaText, kannadaTypename, kannadaType, paliTags, paliText, paliType, paliTypename);
      }
    return (
      kannadaTags.length === 0 && kannadaText === "" && kannadaType === "" && kannadaTypename === "" &&
      paliTags.length === 0 && paliText === "" && paliType === "" && paliTypename === ""
    );
  };
  
  
  const  removeTrailingEmptyRowsLoop = useCallback((contentRows: ContentRow[]) =>{
    let lastNonEmptyIndex = -1;
  
    // Loop backwards from the end of the array
    for (let i = contentRows.length - 1; i >= 0; i--) {
      console.log("hello ", i)
      // If we find a row that is NOT empty...
      if (!isRowEmpty(contentRows[i])) {
        // ...we record its index and stop looking.
        lastNonEmptyIndex = i;
        break;
      }
    }
  
    // If we found a non-empty row, slice up to it.
    // Otherwise, return an empty array (since -1 + 1 = 0).
    return contentRows.slice(0, lastNonEmptyIndex + 1);
  }, [])
  
  // Export handler
  const handleExport = useCallback((exportType: 'both' | 'pali' | 'kannada') => {
    if (contentRows.length === 0) {
      messageApi.warning('No content to export');
      return;
    }
    console.log({contentRows})
    const { data, count } = exportData(removeTrailingEmptyRowsLoop(contentRows), exportType);

    if (count === 0) {
      messageApi.warning(`No ${exportType} content to export`);
      return;
    }

    downloadJSON(data, `bilingual-alignment-${exportType}`);
    messageApi.success(`${count} row(s) exported successfully!`);
  }, [contentRows, messageApi, removeTrailingEmptyRowsLoop]);

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

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0e0f13'
      }}>
        <div>Loading...</div>
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

        <ContentDisplay
          contentRows={contentRows}
          selectedPaliIds={selectedPaliIds}
          selectedKannadaIds={selectedKannadaIds}
          onSelectAll={(column) => handleSelectAll(column, contentRows)}
          onCheckboxChange={handleCheckboxChange}
          onEdit={openEditModal}
          onSave={() => saveToLocalStorage(contentRows, history, historyIndex)}
          onExport={handleExport}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearAll={() => setIsClearModalVisible(true)}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          historyCount={history.length}
        />

        <Footer contentRows={contentRows} historyCount={history.length} />

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
        />

        <TagModal
          visible={isTagModalVisible}
          column={currentTagColumn}
          selectedIds={currentTagColumn === 'pali' ? selectedPaliIds : selectedKannadaIds}
          onClose={() => setIsTagModalVisible(false)}
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
            messageApi.success(`Tags and types added to ${currentTagColumn} content successfully!`);
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
    </div>
  );
};

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}