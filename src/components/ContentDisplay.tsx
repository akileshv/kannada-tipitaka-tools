import React from 'react';
import { Card, Empty } from 'antd';
import type { ContentRow } from '../types';
import { ColumnHeader } from './ColumnHeader';
import { ActionBar } from './ActionBar';
import { ContentRow as ContentRowComponent } from './ContentRow';

interface ContentDisplayProps {
  contentRows: ContentRow[];
  selectedPaliIds: Set<string>;
  selectedKannadaIds: Set<string>;
  onSelectAll: (column: 'pali' | 'kannada') => void;
  onCheckboxChange: (id: string, column: 'pali' | 'kannada', selectBoth?: boolean) => void;
  onEdit: (row: ContentRow) => void;
  onQuickEditPali: (row: ContentRow) => void;
  onQuickEditKannada: (row: ContentRow) => void;
  onSave: () => void;
  onExport: (type: 'both' | 'pali' | 'kannada') => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyCount: number;
  isFullViewMode?: boolean;
  fontSize?: number;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  contentRows,
  selectedPaliIds,
  selectedKannadaIds,
  onSelectAll,
  onCheckboxChange,
  onEdit,
  onQuickEditPali,
  onQuickEditKannada,
  onSave,
  onExport,
  onUndo,
  onRedo,
  onClearAll,
  canUndo,
  canRedo,
  historyCount,
  isFullViewMode = false,
  fontSize = 100,
}) => {
  return (
    <Card 
      style={{ 
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        borderColor: '#303030',
        ...(isFullViewMode ? {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%'
        } : {})
      }}
      styles={{ 
        body: { 
          padding: '16px',
          ...(isFullViewMode ? {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
            minHeight: 0
          } : {})
        } 
      }}
    >
      <ColumnHeader
  selectedPaliCount={selectedPaliIds.size}
  selectedKannadaCount={selectedKannadaIds.size}
  totalRows={contentRows.length}
  onSelectAllPali={() => onSelectAll('pali')}
  onSelectAllKannada={() => onSelectAll('kannada')}
  isFullViewMode={isFullViewMode}
  fontSize={fontSize} // ✅ ADD THIS
/>

      {!isFullViewMode && (
        <ActionBar
          onSave={onSave}
          onExport={onExport}
          onUndo={onUndo}
          onRedo={onRedo}
          onClearAll={onClearAll}
          canUndo={canUndo}
          canRedo={canRedo}
          historyCount={historyCount}
          hasContent={contentRows.length > 0}
        />
      )}

      {contentRows.length === 0 ? (
        <Empty
          description={
            <span style={{ color: '#8c8c8c' }}>
              No content yet. Upload files to get started.
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '48px' }}
        />
      ) : (
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          maxHeight: isFullViewMode ? '100%' : '70vh'
        }}>
          {contentRows.map((row, index) => (
            <ContentRowComponent
              key={row.id}
              row={row}
              index={index}
              isPaliSelected={selectedPaliIds.has(row.id)}
              isKannadaSelected={selectedKannadaIds.has(row.id)}
              onPaliCheck={(selectBoth?: boolean) => {
                onCheckboxChange(row.id, 'pali', selectBoth);
              }}
              onKannadaCheck={(selectBoth?: boolean) => {
                onCheckboxChange(row.id, 'kannada', selectBoth);
              }}
              onEdit={() => onEdit(row)}
              onQuickEditPali={() => onQuickEditPali(row)}
              onQuickEditKannada={() => onQuickEditKannada(row)}
              fontSize={fontSize}
            />
          ))}
        </div>
      )}
    </Card>
  );
};