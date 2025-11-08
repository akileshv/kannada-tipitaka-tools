import { useCallback } from 'react';
import type { ContentRow, HistoryState } from '../types';
import { STORAGE_KEY, HISTORY_KEY, HISTORY_INDEX_KEY } from '../constants';
import { MessageInstance } from 'antd/es/message/interface'; // Assuming Ant Design's message API

interface UseLocalStorageReturn {
  loadFromLocalStorage: () => {
    contentRows: ContentRow[];
    history: HistoryState[];
    historyIndex: number;
  };
  saveToLocalStorage: (
    contentRows: ContentRow[],
    history: HistoryState[],
    historyIndex: number
  ) => void;
  clearLocalStorage: () => void;
}

export const useLocalStorage = (
  messageApi: MessageInstance
): UseLocalStorageReturn => {
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      const savedHistoryIndex = localStorage.getItem(HISTORY_INDEX_KEY);

      return {
        contentRows: savedData ? JSON.parse(savedData) : [],
        history: savedHistory ? JSON.parse(savedHistory) : [],
        historyIndex: savedHistoryIndex ? parseInt(savedHistoryIndex, 10) : -1,
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      messageApi.error('Failed to load saved data');
      return { contentRows: [], history: [], historyIndex: -1 };
    }
  }, [messageApi]);

  const saveToLocalStorage = useCallback((
    contentRows: ContentRow[],
    history: HistoryState[],
    historyIndex: number
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contentRows));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      localStorage.setItem(HISTORY_INDEX_KEY, historyIndex.toString());
      messageApi.success('Progress saved successfully!');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      messageApi.error('Failed to save progress');
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        messageApi.error('Storage quota exceeded. Try exporting and clearing old data.');
      } else {
        throw error;
      }
    }
  }, [messageApi]);

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(HISTORY_INDEX_KEY);
  }, []);

  return {
    loadFromLocalStorage,
    saveToLocalStorage,
    clearLocalStorage,
  };
};