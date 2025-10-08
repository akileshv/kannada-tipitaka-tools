import React from 'react';
import { Modal, Space, Typography } from 'antd';
import { ClearOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ClearModalProps {
  visible: boolean;
  rowCount: number;
  historyCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearModal: React.FC<ClearModalProps> = ({
  visible,
  rowCount,
  historyCount,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title={
        <Space>
          <ClearOutlined style={{ color: '#ff4d4f' }} />
          <span>Clear All Data</span>
        </Space>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes, Clear Everything"
      cancelText="Cancel"
      okButtonProps={{ danger: true, icon: <DeleteOutlined /> }}
      width={500}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ 
          padding: '16px', 
          background: '#2a1215', 
          borderRadius: '6px',
          border: '1px solid #ff4d4f'
        }}>
          <Text style={{ fontSize: '16px', color: '#ff4d4f' }}>
            <strong>⚠️ Warning:</strong> This action cannot be undone!
          </Text>
        </div>
        
        <div>
          <Text style={{ color: '#e0e3e7' }}>
            Are you sure you want to clear all data? This will permanently remove:
          </Text>
          <ul style={{ marginTop: '12px', color: '#a0a3aa' }}>
            <li>All content rows ({rowCount} rows)</li>
            <li>Complete edit history ({historyCount} states)</li>
            <li>All tags and metadata</li>
            <li>All saved progress</li>
          </ul>
        </div>
        
        <div style={{ 
          padding: '12px', 
          background: '#1f1f1f', 
          borderRadius: '6px',
          borderLeft: '3px solid #faad14'
        }}>
          <Text type="secondary">
            <strong>Tip:</strong> Consider exporting your data before clearing if you might need it later.
          </Text>
        </div>
      </Space>
    </Modal>
  );
};