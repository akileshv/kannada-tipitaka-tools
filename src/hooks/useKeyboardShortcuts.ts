import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave?: () => void;
  onMergePali?: () => void;
  onMergeKannada?: () => void;
  onDeletePaliContent?: () => void;
  onDeleteKannadaContent?: () => void;
  onDeleteEntireRows?: () => void;
  onAddPaliTags?: () => void;
  onAddKannadaTags?: () => void;
  onAddBothTags?: () => void;
  onExportPali?: () => void;
  onExportKannada?: () => void;
  onExportBoth?: () => void;
  onClearAll?: () => void;
  onClearAllSelections?: () => void;
  onClearPaliSelection?: () => void;
  onClearKannadaSelection?: () => void;
  hasPaliSelection?: boolean;
  hasKannadaSelection?: boolean;
  onToggleFullView?: () => void;
}

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onMergePali,
  onMergeKannada,
  onDeletePaliContent,
  onDeleteKannadaContent,
  onDeleteEntireRows,
  onAddPaliTags,
  onAddKannadaTags,
  onAddBothTags,
  onExportPali,
  onExportKannada,
  onExportBoth,
  onClearAll,
  onClearAllSelections,
  onClearPaliSelection,
  onClearKannadaSelection,
  hasPaliSelection = false,
  hasKannadaSelection = false,
  onToggleFullView,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const isMod = e.ctrlKey || e.metaKey;

      // ============= CLEAR SELECTIONS =============
      
      // ✅ Clear ALL selections: Ctrl+Shift+C
      if (isMod && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (hasPaliSelection || hasKannadaSelection) {
          onClearAllSelections?.();
        }
        return;
      }

      // ✅ CHANGED: Clear Pali Only: Ctrl+Shift+[
      if (isMod && e.shiftKey && e.key === '{') {
        e.preventDefault();
        if (hasPaliSelection) {
          onClearPaliSelection?.();
        }
        return;
      }

      // ✅ CHANGED: Clear Kannada Only: Ctrl+Shift+]
      if (isMod && e.shiftKey && e.key === '}') {
        e.preventDefault();
        if (hasKannadaSelection) {
          onClearKannadaSelection?.();
        }
        return;
      }

      // ============= GENERAL SHORTCUTS =============
      
      // Undo: Ctrl/Cmd+Z
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) onUndo();
        return;
      }

      // Redo: Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y
      if ((isMod && e.shiftKey && e.key === 'Z') || (isMod && e.key === 'y')) {
        e.preventDefault();
        if (canRedo) onRedo();
        return;
      }

      // Save: Ctrl/Cmd+S
      if (isMod && e.key === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Toggle Full View: F9
      if (e.key === 'F9') {
        e.preventDefault();
        onToggleFullView?.();
        return;
      }

      // ============= CONTEXT-AWARE SHORTCUTS =============
      
      // Merge: Ctrl/Cmd+M
      if (isMod && !e.shiftKey && e.key === 'm') {
        e.preventDefault();
        if (hasPaliSelection && !hasKannadaSelection) {
          onMergePali?.();
        } else if (hasKannadaSelection && !hasPaliSelection) {
          onMergeKannada?.();
        } else if (hasPaliSelection && hasKannadaSelection) {
          onMergePali?.();
        }
        return;
      }

      // Delete Content: Ctrl/Cmd+D
      if (isMod && !e.shiftKey && e.key === 'd') {
        e.preventDefault();
        if (hasPaliSelection && !hasKannadaSelection) {
          onDeletePaliContent?.();
        } else if (hasKannadaSelection && !hasPaliSelection) {
          onDeleteKannadaContent?.();
        } else if (hasPaliSelection && hasKannadaSelection) {
          onDeletePaliContent?.();
        }
        return;
      }

      // Add Tags: Ctrl/Cmd+T
      if (isMod && !e.shiftKey && e.key === 't') {
        e.preventDefault();
        if (hasPaliSelection && !hasKannadaSelection) {
          onAddPaliTags?.();
        } else if (hasKannadaSelection && !hasPaliSelection) {
          onAddKannadaTags?.();
        } else if (hasPaliSelection && hasKannadaSelection) {
          onAddPaliTags?.();
        }
        return;
      }

      // ============= BULK OPERATIONS =============
      
      // Add Tags to BOTH: Ctrl/Cmd+Shift+B
      if (isMod && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        if (hasPaliSelection || hasKannadaSelection) {
          onAddBothTags?.();
        }
        return;
      }

      // ============= PALI-SPECIFIC SHORTCUTS =============
      
      // Merge Pali: Ctrl/Cmd+Shift+M
      if (isMod && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        if (hasPaliSelection) onMergePali?.();
        return;
      }

      // Delete Pali Content: Ctrl/Cmd+Shift+D
      if (isMod && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (hasPaliSelection) onDeletePaliContent?.();
        return;
      }

      // Add Pali Tags: Ctrl/Cmd+Shift+T
      if (isMod && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        if (hasPaliSelection) onAddPaliTags?.();
        return;
      }

      // Export Pali: Ctrl/Cmd+Shift+P
      if (isMod && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        onExportPali?.();
        return;
      }

      // ============= KANNADA-SPECIFIC SHORTCUTS =============
      
      // Merge Kannada: Ctrl/Cmd+Shift+K
      if (isMod && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        if (hasKannadaSelection) onMergeKannada?.();
        return;
      }

      // Delete Entire Rows: Ctrl/Cmd+Shift+Backspace
      if (isMod && e.shiftKey && e.key === 'Backspace') {
        e.preventDefault();
        if (hasPaliSelection || hasKannadaSelection) {
          onDeleteEntireRows?.();
        }
        return;
      }

      // Add Kannada Tags: Ctrl/Cmd+Shift+G
      if (isMod && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        if (hasKannadaSelection) onAddKannadaTags?.();
        return;
      }

      // Delete Kannada Content: Ctrl/Cmd+Shift+X
      if (isMod && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        if (hasKannadaSelection) onDeleteKannadaContent?.();
        return;
      }

      // ============= EXPORT SHORTCUTS =============
      
      // Export Both: Ctrl/Cmd+E
      if (isMod && !e.shiftKey && e.key === 'e') {
        e.preventDefault();
        onExportBoth?.();
        return;
      }

      // Export Kannada: Ctrl/Cmd+Shift+L
      if (isMod && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        onExportKannada?.();
        return;
      }

      // ============= DANGER ZONE =============
      
      // Clear All Data: Ctrl/Cmd+Shift+Delete
      if (isMod && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        onClearAll?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onSave,
    onMergePali,
    onMergeKannada,
    onDeletePaliContent,
    onDeleteKannadaContent,
    onDeleteEntireRows,
    onAddPaliTags,
    onAddKannadaTags,
    onAddBothTags,
    onExportPali,
    onExportKannada,
    onExportBoth,
    onClearAll,
    onClearAllSelections,
    onClearPaliSelection,
    onClearKannadaSelection,
    hasPaliSelection,
    hasKannadaSelection,
    onToggleFullView,
  ]);
};