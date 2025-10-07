import React from 'react';
import { Modal, Input, Space, Typography } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface EditModalProps {
  visible: boolean;
  column: 'pali' | 'kannada';
  text: string;
  onTextChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  visible,
  column,
  text,
  onTextChange,
  onSave,
  onCancel,
}) => {
  return (
    <Modal
      title={
        <Space>
          <EditOutlined style={{ color: column === 'pali' ? '#1890ff' : '#52c41a' }} />
          <span>Edit {column === 'pali' ? 'Pali' : 'Kannada'} Text</span>
        </Space>
      }
      open={visible}
      onOk={onSave}
      onCancel={onCancel}
      width={800}
      okText="Save Changes"
      cancelText="Cancel"
      okButtonProps={{ icon: <SaveOutlined /> }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <div style={{ marginBottom: '8px' }}>
            <Title level={5} style={{ 
              marginBottom: '4px', 
              color: column === 'pali' ? '#1890ff' : '#52c41a' 
            }}>
              {column === 'pali' ? 'Pali' : 'Kannada'} Text
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Use line breaks to split into multiple rows
            </Text>
          </div>
          <TextArea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            rows={6}
            placeholder={`Enter ${column} text (use newlines to split into multiple rows)`}
            style={{ 
              fontSize: '14px',
              fontFamily: 'monospace',
              borderColor: column === 'pali' ? '#1890ff' : '#52c41a'
            }}
          />
        </div>
        <div style={{ 
          padding: '12px', 
          background: '#1f1f1f', 
          borderRadius: '6px',
          borderLeft: `3px solid ${column === 'pali' ? '#1890ff' : '#52c41a'}`
        }}>
          <Text type="secondary">
            <strong>Tip:</strong> Leave empty to delete this {column} entry. Each line will become a separate entry.
          </Text>
        </div>
      </Space>
    </Modal>
  );
};