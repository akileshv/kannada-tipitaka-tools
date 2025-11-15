import { useState, useCallback } from 'react';
import type { ContentRow } from '../types';

interface UseSelectionReturn {
  selectedPaliIds: Set<string>;
  selectedKannadaIds: Set<string>;
  lastSelectedPaliId: string | null;
  lastSelectedKannadaId: string | null;
  lastSelectionWasBoth: boolean; // ✅ NEW: Track if last selection was both columns
  setSelectedPaliIds: (ids: Set<string>) => void;
  setSelectedKannadaIds: (ids: Set<string>) => void;
  handleSelectAll: (column: 'pali' | 'kannada', contentRows: ContentRow[]) => void;
  handleCheckboxChange: (
    id: string, 
    column: 'pali' | 'kannada', 
    selectBoth: boolean,
    isShiftClick: boolean,
    contentRows: ContentRow[]
  ) => void;
  clearSelection: (column: 'pali' | 'kannada' | 'both') => void;
}

export const useSelection = (): UseSelectionReturn => {
  const [selectedPaliIds, setSelectedPaliIds] = useState<Set<string>>(new Set());
  const [selectedKannadaIds, setSelectedKannadaIds] = useState<Set<string>>(new Set());
  const [lastSelectedPaliId, setLastSelectedPaliId] = useState<string | null>(null);
  const [lastSelectedKannadaId, setLastSelectedKannadaId] = useState<string | null>(null);
  const [lastSelectionWasBoth, setLastSelectionWasBoth] = useState<boolean>(false); // ✅ NEW

  const handleSelectAll = useCallback((column: 'pali' | 'kannada', contentRows: ContentRow[]) => {
    const allIds = new Set(contentRows.map(row => row.id));
    if (column === 'pali') {
      setSelectedPaliIds(selectedPaliIds.size === contentRows.length ? new Set() : allIds);
    } else {
      setSelectedKannadaIds(selectedKannadaIds.size === contentRows.length ? new Set() : allIds);
    }
    setLastSelectionWasBoth(false);
  }, [selectedPaliIds, selectedKannadaIds]);

  const handleCheckboxChange = useCallback((
    id: string, 
    column: 'pali' | 'kannada',
    selectBoth: boolean = false,
    isShiftClick: boolean = false,
    contentRows: ContentRow[] = []
  ) => {
    // ✅ SMART RANGE SELECTION with Shift+Click
    if (isShiftClick && contentRows.length > 0) {
      // Determine which column to use for range
      const lastId = column === 'pali' ? lastSelectedPaliId : lastSelectedKannadaId;
      
      if (lastId) {
        const currentIndex = contentRows.findIndex(row => row.id === id);
        const lastIndex = contentRows.findIndex(row => row.id === lastId);
        
        if (currentIndex !== -1 && lastIndex !== -1) {
          const startIndex = Math.min(currentIndex, lastIndex);
          const endIndex = Math.max(currentIndex, lastIndex);
          const rangeIds = contentRows.slice(startIndex, endIndex + 1).map(row => row.id);
          
          // Check if all in range are already selected
          const checkSet = column === 'pali' ? selectedPaliIds : selectedKannadaIds;
          const allSelected = rangeIds.every(rid => checkSet.has(rid));
          
          // ✅ KEY FIX: If last selection was "both", continue selecting both
          const shouldSelectBoth = selectBoth || lastSelectionWasBoth;
          
          if (shouldSelectBoth) {
            // Range select both columns
            setSelectedPaliIds(prev => {
              const newSet = new Set(prev);
              rangeIds.forEach(rid => allSelected ? newSet.delete(rid) : newSet.add(rid));
              return newSet;
            });
            setSelectedKannadaIds(prev => {
              const newSet = new Set(prev);
              rangeIds.forEach(rid => allSelected ? newSet.delete(rid) : newSet.add(rid));
              return newSet;
            });
            setLastSelectedPaliId(id);
            setLastSelectedKannadaId(id);
            setLastSelectionWasBoth(true);
          } else if (column === 'pali') {
            setSelectedPaliIds(prev => {
              const newSet = new Set(prev);
              rangeIds.forEach(rid => allSelected ? newSet.delete(rid) : newSet.add(rid));
              return newSet;
            });
            setLastSelectedPaliId(id);
            setLastSelectionWasBoth(false);
          } else {
            setSelectedKannadaIds(prev => {
              const newSet = new Set(prev);
              rangeIds.forEach(rid => allSelected ? newSet.delete(rid) : newSet.add(rid));
              return newSet;
            });
            setLastSelectedKannadaId(id);
            setLastSelectionWasBoth(false);
          }
          return;
        }
      }
    }

    // ✅ Alt+Click: Select BOTH columns
    if (selectBoth) {
      const bothSelected = selectedPaliIds.has(id) && selectedKannadaIds.has(id);
      
      setSelectedPaliIds(prev => {
        const newSelected = new Set(prev);
        if (bothSelected) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        return newSelected;
      });
      
      setSelectedKannadaIds(prev => {
        const newSelected = new Set(prev);
        if (bothSelected) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        return newSelected;
      });
      
      setLastSelectedPaliId(id);
      setLastSelectedKannadaId(id);
      setLastSelectionWasBoth(true); // ✅ Mark that both were selected
      return;
    }

    // ✅ Normal click: Toggle single column
    if (column === 'pali') {
      setSelectedPaliIds(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        return newSelected;
      });
      setLastSelectedPaliId(id);
      setLastSelectionWasBoth(false);
    } else {
      setSelectedKannadaIds(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        return newSelected;
      });
      setLastSelectedKannadaId(id);
      setLastSelectionWasBoth(false);
    }
  }, [selectedPaliIds, selectedKannadaIds, lastSelectedPaliId, lastSelectedKannadaId, lastSelectionWasBoth]);

  const clearSelection = useCallback((column: 'pali' | 'kannada' | 'both') => {
    if (column === 'pali') {
      setSelectedPaliIds(new Set());
      setLastSelectedPaliId(null);
    } else if (column === 'kannada') {
      setSelectedKannadaIds(new Set());
      setLastSelectedKannadaId(null);
    } else {
      setSelectedPaliIds(new Set());
      setSelectedKannadaIds(new Set());
      setLastSelectedPaliId(null);
      setLastSelectedKannadaId(null);
    }
    setLastSelectionWasBoth(false);
  }, []);

  return {
    selectedPaliIds,
    selectedKannadaIds,
    lastSelectedPaliId,
    lastSelectedKannadaId,
    lastSelectionWasBoth,
    setSelectedPaliIds,
    setSelectedKannadaIds,
    handleSelectAll,
    handleCheckboxChange,
    clearSelection,
  };
};