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
}) => {
  return (
    <Card 
      style={{ 
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        borderColor: '#303030'
      }}
      styles={{ body: { padding: '16px' } }}
    >
      <ColumnHeader
        selectedPaliCount={selectedPaliIds.size}
        selectedKannadaCount={selectedKannadaIds.size}
        totalRows={contentRows.length}
        onSelectAllPali={() => onSelectAll('pali')}
        onSelectAllKannada={() => onSelectAll('kannada')}
      />

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
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
            />
          ))}
        </div>
      )}
    </Card>
  );
};