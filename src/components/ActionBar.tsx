import React from 'react';
import { Space, Button, Tooltip, Dropdown } from 'antd';
import {
  SaveOutlined,
  ClearOutlined,
  DownloadOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';

interface ActionBarProps {
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
  hasContent: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
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
  hasContent,
}) => {
  return (
    <div 
      style={{ 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Space wrap size="middle">
        {/* Save Progress */}
        <Tooltip title="Save all progress to browser storage">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<SaveOutlined style={{ fontSize: '18px' }} />}
            onClick={onSave}
            style={{
              width: '40px',
              height: '40px',
              background: '#30c48d',
              borderColor: '#30c48d',
            }}
          />
        </Tooltip>

        {/* Clear All */}
        <Tooltip title="Clear all data and reset application">
          <Button
            danger
            shape="circle"
            size="large"
            icon={<ClearOutlined style={{ fontSize: '18px' }} />}
            onClick={onClear}
            style={{
              width: '40px',
              height: '40px',
            }}
          />
        </Tooltip>

        {/* Export Dropdown */}
        <Dropdown
          menu={{
            items: [
              {
                key: 'pali',
                label: 'Download Pali',
                icon: <DownloadOutlined />,
                onClick: onExportPali,
                disabled: !hasContent,
              },
              {
                key: 'kannada',
                label: 'Download Kannada',
                icon: <DownloadOutlined />,
                onClick: onExportKannada,
                disabled: !hasContent,
              },
              {
                type: 'divider',
              },
              {
                key: 'both',
                label: 'Download Both',
                icon: <DownloadOutlined />,
                onClick: onExportBoth,
                disabled: !hasContent,
              },
            ],
          }}
          placement="bottomLeft"
          trigger={['click']}
          disabled={!hasContent}
        >
          <Tooltip title="Export data as JSON">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<DownloadOutlined style={{ fontSize: '18px' }} />}
              disabled={!hasContent}
              style={{
                width: '40px',
                height: '40px',
              }}
            />
          </Tooltip>
        </Dropdown>

        {/* Undo */}
        <Tooltip title={`Undo (${historyIndex} actions available)`}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<UndoOutlined style={{ fontSize: '18px' }} />}
            onClick={onUndo}
            disabled={!canUndo}
            style={{
              width: '40px',
              height: '40px',
              background: !canUndo ? '#2a2d34' : '#37a2f2',
              borderColor: !canUndo ? '#2a2d34' : '#37a2f2',
            }}
          />
        </Tooltip>

        {/* Redo */}
        <Tooltip title={`Redo (${historyLength - historyIndex - 1} actions available)`}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<RedoOutlined style={{ fontSize: '18px' }} />}
            onClick={onRedo}
            disabled={!canRedo}
            style={{
              width: '40px',
              height: '40px',
              background: !canRedo ? '#2a2d34' : '#30c48d',
              borderColor: !canRedo ? '#2a2d34' : '#30c48d',
            }}
          />
        </Tooltip>
      </Space>
    </div>
  );
};