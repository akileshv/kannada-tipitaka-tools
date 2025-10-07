import React from 'react';
import { Card, Empty } from 'antd';
import type { ContentRow as ContentRowType } from '../types';
import { ContentRow } from './ContentRow';
import { ColumnHeader } from './ColumnHeader';
import { ActionBar } from './ActionBar';

interface ContentDisplayProps {
  contentRows: ContentRowType[];
  selectedPaliIds: Set<string>;
  selectedKannadaIds: Set<string>;
  onPaliCheckboxChange: (id: string) => void;
  onKannadaCheckboxChange: (id: string) => void;
  onSelectAllPali: () => void;
  onSelectAllKannada: () => void;
  onEditPali: (row: ContentRowType) => void;
  onEditKannada: (row: ContentRowType) => void;
  onOpenPaliTagModal: (row: ContentRowType) => void;
  onOpenKannadaTagModal: (row: ContentRowType) => void;
  onSave: () => void;
  onClear: () => void;
  onExportPali: () => void;
  onExportKannada: () => void;
  onExportBoth: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyIndex: number;
  historyLength: number;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  contentRows,
  selectedPaliIds,
  selectedKannadaIds,
  onPaliCheckboxChange,
  onKannadaCheckboxChange,
  onSelectAllPali,
  onSelectAllKannada,
  onEditPali,
  onEditKannada,
  onOpenPaliTagModal,
  onOpenKannadaTagModal,
  onSave,
  onClear,
  onExportPali,
  onExportKannada,
  onExportBoth,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  historyIndex,
  historyLength,
}) => {
  const allPaliSelected = selectedPaliIds.size === contentRows.length && contentRows.length > 0;
  const allKannadaSelected = selectedKannadaIds.size === contentRows.length && contentRows.length > 0;
  const somePaliSelected = selectedPaliIds.size > 0 && selectedPaliIds.size < contentRows.length;
  const someKannadaSelected = selectedKannadaIds.size > 0 && selectedKannadaIds.size < contentRows.length;

  return (
    <Card 
      style={{ 
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        borderColor: '#303030'
      }}
      styles={{ body: { padding: '16px' } }}
    >
      <ActionBar
        onSave={onSave}
        onClear={onClear}
        onExportPali={onExportPali}
        onExportKannada={onExportKannada}
        onExportBoth={onExportBoth}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        historyIndex={historyIndex}
        historyLength={historyLength}
        hasContent={contentRows.length > 0}
      />

      <ColumnHeader
        paliSelectedCount={selectedPaliIds.size}
        kannadaSelectedCount={selectedKannadaIds.size}
        onSelectAllPali={onSelectAllPali}
        onSelectAllKannada={onSelectAllKannada}
        allPaliSelected={allPaliSelected}
        allKannadaSelected={allKannadaSelected}
        somePaliSelected={somePaliSelected}
        someKannadaSelected={someKannadaSelected}
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
            <ContentRow
              key={row.id}
              row={row}
              isPaliSelected={selectedPaliIds.has(row.id)}
              isKannadaSelected={selectedKannadaIds.has(row.id)}
              onPaliCheckboxChange={() => onPaliCheckboxChange(row.id)}
              onKannadaCheckboxChange={() => onKannadaCheckboxChange(row.id)}
              onEditPali={() => onEditPali(row)}
              onEditKannada={() => onEditKannada(row)}
              onOpenPaliTagModal={() => onOpenPaliTagModal(row)}      // ✅ ADD THIS
              onOpenKannadaTagModal={() => onOpenKannadaTagModal(row)} // ✅ ADD THIS
            />
          ))}
        </div>
      )}
    </Card>
  );
};