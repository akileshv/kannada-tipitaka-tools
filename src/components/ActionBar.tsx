import React from 'react';
import { Space, Button, Tooltip, Dropdown } from 'antd';
import {
  SaveOutlined,
  DownloadOutlined,
  UndoOutlined,
  RedoOutlined,
  ClearOutlined,
} from '@ant-design/icons';

interface ActionBarProps {
  onSave: () => void;
  onExport: (type: 'both' | 'pali' | 'kannada') => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearAll: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyCount: number;
  hasContent: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onSave,
  onExport,
  onUndo,
  onRedo,
  onClearAll,
  canUndo,
  canRedo,
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
            onClick={onClearAll}
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
                onClick: () => onExport('pali'),
                disabled: !hasContent,
              },
              {
                key: 'kannada',
                label: 'Download Kannada',
                icon: <DownloadOutlined />,
                onClick: () => onExport('kannada'),
                disabled: !hasContent,
              },
              {
                type: 'divider',
              },
              {
                key: 'both',
                label: 'Download Both',
                icon: <DownloadOutlined />,
                onClick: () => onExport('both'),
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
        <Tooltip title={`Undo (${canUndo ? 'Ctrl+Z' : 'No actions to undo'})`}>
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
              background: canUndo ? '#37a2f2' : '#2a2d34',
              borderColor: canUndo ? '#37a2f2' : '#2a2d34',
            }}
          />
        </Tooltip>

        {/* Redo */}
        <Tooltip title={`Redo (${canRedo ? 'Ctrl+Shift+Z' : 'No actions to redo'})`}>
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
              background: canRedo ? '#30c48d' : '#2a2d34',
              borderColor: canRedo ? '#30c48d' : '#2a2d34',
            }}
          />
        </Tooltip>
      </Space>
    </div>
  );
};