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
  onExportPali?: () => void;
  onExportKannada?: () => void;
  onExportBoth?: () => void;
  onClearAll?: () => void;
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
  onExportPali,
  onExportKannada,
  onExportBoth,
  onClearAll,
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
      
      // Escape: Clear all selections
      if (e.key === 'Escape') {
        e.preventDefault();
        if (hasPaliSelection) onClearPaliSelection?.();
        if (hasKannadaSelection) onClearKannadaSelection?.();
        return;
      }

      // Clear Pali Selection: Ctrl/Cmd+Shift+C
      if (isMod && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (hasPaliSelection) onClearPaliSelection?.();
        return;
      }

      // Clear Kannada Selection: Ctrl/Cmd+Shift+N
      if (isMod && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        if (hasKannadaSelection) onClearKannadaSelection?.();
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
      if ((isMod && e.shiftKey && e.key === 'z') || (isMod && e.key === 'y')) {
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

      if (e.key === 'F9') {
        e.preventDefault();
        onToggleFullView?.();
        return;
      }

      // ============= CONTEXT-AWARE SHORTCUTS =============
      // These work on whichever column is selected
      
      // Merge: Ctrl/Cmd+M
      if (isMod && !e.shiftKey && e.key === 'm') {
        e.preventDefault();
        if (hasPaliSelection && !hasKannadaSelection) {
          onMergePali?.();
        } else if (hasKannadaSelection && !hasPaliSelection) {
          onMergeKannada?.();
        } else if (hasPaliSelection && hasKannadaSelection) {
          // Both selected - prioritize Pali
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
          // Both selected - delete Pali first
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
          // Both selected - prioritize Pali
          onAddPaliTags?.();
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

      // Delete Kannada Content: Ctrl/Cmd+Shift+Backspace
      if (isMod && e.shiftKey && e.key === 'Backspace') {
        e.preventDefault();
        if (hasPaliSelection || hasKannadaSelection) {
          onDeleteEntireRows?.();
        }
        return;
      }

      // Add Kannada Tags: Ctrl/Cmd+Shift+G (G for taGs, since T is taken)
      if (isMod && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        if (hasKannadaSelection) onAddKannadaTags?.();
        return;
      }

      // ✅ ADD THIS: Delete Kannada Content: Ctrl/Cmd+Shift+X
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

      // Export Kannada: Ctrl/Cmd+Shift+L (L for Language)
      if (isMod && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        onExportKannada?.();
        return;
      }

      // ============= DANGER ZONE =============
      
      // Delete Entire Rows: Ctrl/Cmd+Shift+Backspace (already covered above)
      
      // Clear All: Ctrl/Cmd+Shift+Delete
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
    onExportPali,
    onExportKannada,
    onExportBoth,
    onClearAll,
    hasPaliSelection,
    hasKannadaSelection,
    onClearPaliSelection,
    onClearKannadaSelection,
    onToggleFullView,
  ]);
};