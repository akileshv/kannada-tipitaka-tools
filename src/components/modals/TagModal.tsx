import React, { useState, useEffect } from 'react';
import { Modal, Input, Space, Button, Typography, Tag, Select, Divider } from 'antd';
import { TagsOutlined, PlusOutlined } from '@ant-design/icons';
// import type { ContentRow } from '../../types';

const { Title, Text } = Typography;

interface TagModalProps {
  visible: boolean;
  column: 'pali' | 'kannada';
  selectedIds: Set<string>;
  onClose: () => void;
  onApply: (tags: string[], type: string, typename: string) => void;
}

export const TagModal: React.FC<TagModalProps> = ({
  visible,
  column,
  selectedIds,
  onClose,
  onApply,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [tagItems, setTagItems] = useState<string[]>([]);
  const [typeInput, setTypeInput] = useState<string>('');
  const [typenameInput, setTypenameInput] = useState<string>('');

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setTagInput('');
      setTagItems([]);
      setTypeInput('');
      setTypenameInput('');
    }
  }, [visible]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tagItems.includes(tagInput.trim())) {
      setTagItems([...tagItems, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagItems(tagItems.filter(tag => tag !== tagToRemove));
  };

  const handleApply = () => {
    if (selectedIds.size === 0) {
      return;
    }
    onApply(tagItems, typeInput, typenameInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Modal
      title={
        <Space>
          <TagsOutlined style={{ color: column === 'pali' ? '#1890ff' : '#52c41a' }} />
          <span>Add Tags and Types to {column === 'pali' ? 'Pali' : 'Kannada'} Content</span>
        </Space>
      }
      open={visible}
      onOk={handleApply}
      onCancel={onClose}
      okText="Apply"
      cancelText="Cancel"
      width={700}
      okButtonProps={{
        disabled: selectedIds.size === 0,
        style: {
          backgroundColor: column === 'pali' ? '#1890ff' : '#52c41a',
          borderColor: column === 'pali' ? '#1890ff' : '#52c41a',
        }
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Selected Count Info */}
        {selectedIds.size > 0 && (
          <div style={{ 
            padding: '12px', 
            background: '#1f1f1f', 
            borderRadius: '6px',
            borderLeft: `3px solid ${column === 'pali' ? '#1890ff' : '#52c41a'}`
          }}>
            <Text style={{ color: '#e0e3e7' }}>
              <strong>{selectedIds.size}</strong> {column} row{selectedIds.size > 1 ? 's' : ''} selected
            </Text>
          </div>
        )}

        {/* Tags Section */}
        <div>
          <Title level={5} style={{ marginBottom: '8px', color: '#e0e3e7' }}>
            Tags
          </Title>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Enter a tag and press Enter"
              onPressEnter={handleKeyPress}
              style={{ flex: 1 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              style={{ 
                borderColor: column === 'pali' ? '#1890ff' : '#52c41a', 
                backgroundColor: column === 'pali' ? '#1890ff' : '#52c41a' 
              }}
            >
              Add
            </Button>
          </Space.Compact>
          {tagItems && tagItems.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Current tags:</Text>
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {tagItems.map((tag, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveTag(tag)}
                    color={column === 'pali' ? 'blue' : 'green'}
                    style={{ marginBottom: '4px' }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Divider style={{ margin: '8px 0' }} />
        
        {/* Type Section */}
        <div>
          <Title level={5} style={{ marginBottom: '8px', color: '#e0e3e7' }}>
            Type (HTML Tag)
          </Title>
          <Select
            style={{ width: '100%' }}
            value={typeInput}
            onChange={setTypeInput}
            placeholder="Select HTML element type (optional)"
            allowClear
            size="large"
          >
            <Select.Option value="h1">H1 - Main Heading</Select.Option>
            <Select.Option value="h2">H2 - Section Heading</Select.Option>
            <Select.Option value="h3">H3 - Sub-heading</Select.Option>
            <Select.Option value="h4">H4 - Minor Heading</Select.Option>
            <Select.Option value="h5">H5 - Small Heading</Select.Option>
            <Select.Option value="h6">H6 - Smallest Heading</Select.Option>
            <Select.Option value="p">P - Paragraph</Select.Option>
            <Select.Option value="blockquote">Blockquote</Select.Option>
          </Select>
        </div>

        {/* Typename Section */}
        <div>
          <Title level={5} style={{ marginBottom: '8px', color: '#e0e3e7' }}>
            Typename (Semantic Type)
          </Title>
          <Select
            style={{ width: '100%' }}
            value={typenameInput}
            onChange={setTypenameInput}
            placeholder="Select semantic content type (optional)"
            allowClear
            size="large"
          >
            <Select.Option value="title">Title</Select.Option>
            <Select.Option value="subtitle">Subtitle</Select.Option>
            <Select.Option value="paragraph">Paragraph</Select.Option>
            <Select.Option value="stanza">Stanza (Verse)</Select.Option>
            <Select.Option value="(empty)">(Empty)</Select.Option>
            <Select.Option value="commentary">Commentary</Select.Option>
            <Select.Option value="footnote">Footnote</Select.Option>
          </Select>
        </div>
        
        {/* Help Text */}
        <div style={{ 
          padding: '12px', 
          background: '#1f1f1f', 
          borderRadius: '6px',
          borderLeft: `3px solid ${column === 'pali' ? '#1890ff' : '#52c41a'}`
        }}>
          <Space direction="vertical" size="small">
            <Text type="secondary">
              <strong>💡 Note:</strong>
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              • Tags will be added to existing tags (duplicates will be removed)
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              • Type and Typename will replace existing values
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              • These attributes will be applied to all selected {column} rows
            </Text>
          </Space>
        </div>
      </Space>
    </Modal>
  );
};