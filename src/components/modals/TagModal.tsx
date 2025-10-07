import React from 'react';
import { Modal, Input, Space, Button, Tag, Divider, Typography, Select } from 'antd';
import { TagsOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TagModalProps {
  visible: boolean;
  column: 'pali' | 'kannada';
  tagInput: string;
  tagItems: string[];
  typeInput: string;
  typenameInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTypeChange: (value: string) => void;
  onTypenameChange: (value: string) => void;
  onApply: () => void;
  onCancel: () => void;
}

export const TagModal: React.FC<TagModalProps> = ({
  visible,
  column,
  tagInput,
  tagItems,
  typeInput,
  typenameInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onTypeChange,
  onTypenameChange,
  onApply,
  onCancel,
}) => {
  return (
    <Modal
      title={
        <Space>
          <TagsOutlined style={{ color: column === 'pali' ? '#1890ff' : '#52c41a' }} />
          <span>Add Tags and Types to {column === 'pali' ? 'Pali' : 'Kannada'} Content</span>
        </Space>
      }
      open={visible}
      onOk={onApply}
      onCancel={onCancel}
      okText="Apply"
      cancelText="Cancel"
      width={700}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={5} style={{ marginBottom: '8px' }}>
            Tags
          </Title>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              placeholder="Enter a tag"
              onPressEnter={onAddTag}
              style={{ flex: 1 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={onAddTag}
              style={{ 
                borderColor: column === 'pali' ? '#1890ff' : '#52c41a', 
                backgroundColor: column === 'pali' ? '#1890ff' : '#52c41a' 
              }}
            >
              Add
            </Button>
          </Space.Compact>
          {tagItems.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Current tags:</Text>
              <div style={{ marginTop: '4px' }}>
                {tagItems.map((tag, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => onRemoveTag(tag)}
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
        
        <div>
          <Title level={5} style={{ marginBottom: '8px' }}>
            Type (HTML Tag)
          </Title>
          <Select
            style={{ width: '100%' }}
            value={typeInput}
            onChange={onTypeChange}
            placeholder="Select HTML element type"
            allowClear
            size="large"
          >
            <Select.Option value="h1">H1 - Main Heading</Select.Option>
            <Select.Option value="h2">H2 - Section Heading</Select.Option>
            <Select.Option value="h3">H3 - Sub-heading</Select.Option>
            <Select.Option value="h4">H4 - Minor Heading</Select.Option>
            <Select.Option value="p">P - Paragraph</Select.Option>
            <Select.Option value="blockquote">Blockquote</Select.Option>
          </Select>
        </div>

        <div>
          <Title level={5} style={{ marginBottom: '8px' }}>
            Typename (Semantic Type)
          </Title>
          <Select
            style={{ width: '100%' }}
            value={typenameInput}
            onChange={onTypenameChange}
            placeholder="Select semantic content type"
            allowClear
            size="large"
          >
            <Select.Option value="title">Title</Select.Option>
            <Select.Option value="subtitle">Subtitle</Select.Option>
            <Select.Option value="paragraph">Paragraph</Select.Option>
            <Select.Option value="stanza">Stanza (Verse)</Select.Option>
            <Select.Option value="commentary">Commentary</Select.Option>
            <Select.Option value="footnote">Footnote</Select.Option>
          </Select>
        </div>
        
        <div style={{ 
          padding: '12px', 
          background: '#1f1f1f', 
          borderRadius: '6px',
          borderLeft: `3px solid ${column === 'pali' ? '#1890ff' : '#52c41a'}`
        }}>
          <Text type="secondary">
            <strong>Note:</strong> These attributes will be applied to all selected {column} rows
          </Text>
        </div>
      </Space>
    </Modal>
  );
};