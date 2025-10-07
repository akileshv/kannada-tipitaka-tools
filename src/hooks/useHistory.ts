import { useState, useCallback } from 'react';
import type { ContentRow, HistoryState } from '../types';
import { MAX_HISTORY } from '../constants';

interface UseHistoryReturn {
  history: HistoryState[];
  historyIndex: number;
  setHistory: (history: HistoryState[]) => void;
  setHistoryIndex: (index: number) => void;
  addToHistory: (
    newContentRows: ContentRow[],
    selectedPaliIds: Set<string>,
    selectedKannadaIds: Set<string>
  ) => void;
  handleUndo: () => HistoryState | null;
  handleRedo: () => HistoryState | null;
}

export const useHistory = (): UseHistoryReturn => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const addToHistory = useCallback((
    newContentRows: ContentRow[],
    selectedPaliIds: Set<string>,
    selectedKannadaIds: Set<string>
  ) => {
    const newHistoryState: HistoryState = {
      contentRows: JSON.parse(JSON.stringify(newContentRows)),
      selectedPaliIds: Array.from(selectedPaliIds),
      selectedKannadaIds: Array.from(selectedKannadaIds),
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newHistoryState);

      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      return newHistory;
    });

    setHistoryIndex(prev => {
      const newHistory = history.slice(0, prev + 1);
      return Math.min(newHistory.length, MAX_HISTORY - 1);
    });
  }, [history, historyIndex]);

  const handleUndo = useCallback((): HistoryState | null => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      return prevState;
    }
    return null;
  }, [history, historyIndex]);

  const handleRedo = useCallback((): HistoryState | null => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      return nextState;
    }
    return null;
  }, [history, historyIndex]);

  return {
    history,
    historyIndex,
    setHistory,
    setHistoryIndex,
    addToHistory,
    handleUndo,
    handleRedo,
  };
};