import { useState, useCallback } from 'react';
import type { ContentRow } from '../types';

interface UseSelectionReturn {
  selectedPaliIds: Set<string>;
  selectedKannadaIds: Set<string>;
  setSelectedPaliIds: (ids: Set<string>) => void;
  setSelectedKannadaIds: (ids: Set<string>) => void;
  handleSelectAll: (column: 'pali' | 'kannada', contentRows: ContentRow[]) => void;
  handleCheckboxChange: (id: string, column: 'pali' | 'kannada') => void;
  clearSelection: (column: 'pali' | 'kannada' | 'both') => void;
}

export const useSelection = (): UseSelectionReturn => {
  const [selectedPaliIds, setSelectedPaliIds] = useState<Set<string>>(new Set());
  const [selectedKannadaIds, setSelectedKannadaIds] = useState<Set<string>>(new Set());

  const handleSelectAll = useCallback((column: 'pali' | 'kannada', contentRows: ContentRow[]) => {
    const allIds = new Set(contentRows.map(row => row.id));
    if (column === 'pali') {
      setSelectedPaliIds(selectedPaliIds.size === contentRows.length ? new Set() : allIds);
    } else {
      setSelectedKannadaIds(selectedKannadaIds.size === contentRows.length ? new Set() : allIds);
    }
  }, [selectedPaliIds, selectedKannadaIds]);

  const handleCheckboxChange = useCallback((id: string, column: 'pali' | 'kannada') => {
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
    }
  }, []);

  const clearSelection = useCallback((column: 'pali' | 'kannada' | 'both') => {
    if (column === 'pali') {
      setSelectedPaliIds(new Set());
    } else if (column === 'kannada') {
      setSelectedKannadaIds(new Set());
    } else {
      setSelectedPaliIds(new Set());
      setSelectedKannadaIds(new Set());
    }
  }, []);

  return {
    selectedPaliIds,
    selectedKannadaIds,
    setSelectedPaliIds,
    setSelectedKannadaIds,
    handleSelectAll,
    handleCheckboxChange,
    clearSelection,
  };
};