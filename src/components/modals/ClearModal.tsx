import React from 'react';
import { Modal, Space, Typography } from 'antd';
import { ClearOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ClearModalProps {
  visible: boolean;
  contentRowsCount: number;
  historyLength: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearModal: React.FC<ClearModalProps> = ({
  visible,
  contentRowsCount,
  historyLength,
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
          <Text style={{ fontSize: '16px' }}>
            <strong>Warning:</strong> This action cannot be undone!
          </Text>
        </div>
        
        <div>
          <Text>
            Are you sure you want to clear all data? This will permanently remove:
          </Text>
          <ul style={{ marginTop: '12px', color: '#8c8c8c' }}>
            <li>All content rows ({contentRowsCount} rows)</li>
            <li>Complete edit history ({historyLength} states)</li>
            <li>All tags and metadata</li>
            <li>All saved progress</li>
          </ul>
        </div>
      </Space>
    </Modal>
  );
};