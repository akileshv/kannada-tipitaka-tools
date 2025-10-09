import React from 'react';
import { Card, Row, Col, Space, Checkbox, Button, Tag, Typography, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ContentRow as ContentRowType } from '../types';
import { renderTextWithType } from '../utils/textRenderer';

const { Text } = Typography;

interface ContentRowProps {
  row: ContentRowType;
  index: number;
  isPaliSelected: boolean;
  isKannadaSelected: boolean;
  onPaliCheck: (selectBoth?: boolean) => void;
  onKannadaCheck: (selectBoth?: boolean) => void;
  onEdit: () => void;
  onQuickEditPali?: () => void;
  onQuickEditKannada?: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  row,
  index,
  isPaliSelected,
  isKannadaSelected,
  onPaliCheck,
  onKannadaCheck,
  onEdit,
  onQuickEditPali,
  onQuickEditKannada,
}) => {
  const isAnySelected = isPaliSelected || isKannadaSelected;

  // ✅ Handle Pali checkbox with Shift modifier
  const handlePaliCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Shift+Click: Select both columns
    if (e.shiftKey) {
      e.preventDefault();
      onPaliCheck(true);
      return;
    }
    
    // Normal click: Toggle single checkbox
    onPaliCheck(false);
  };

  // ✅ Handle Kannada checkbox with Shift modifier
  const handleKannadaCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Shift+Click: Select both columns
    if (e.shiftKey) {
      e.preventDefault();
      onKannadaCheck(true);
      return;
    }
    
    // Normal click: Toggle single checkbox
    onKannadaCheck(false);
  };

  return (
    <Card 
      style={{ 
        marginBottom: '8px', 
        backgroundColor: isAnySelected ? '#2a2a2a' : '#1f1f1f',
        border: isAnySelected ? '1px solid #1890ff' : '1px solid #303030',
        transition: 'all 0.3s ease',
        boxShadow: isAnySelected ? '0 2px 8px rgba(24, 144, 255, 0.2)' : 'none'
      }}
      size="small"
      styles={{ body: { padding: '12px' } }}
    >
      <Row gutter={16} align="middle">
        {/* Pali Column */}
        <Col xs={24} md={11}>
          <Space align="start" style={{ width: '100%' }} size="middle">
            <Tooltip title="Click: Select | Shift+Click: Select both">
              <div onClick={handlePaliCheckboxClick} style={{ cursor: 'pointer', display: 'inline-block' }}>
                <Checkbox
                  checked={isPaliSelected}
                  style={{ marginTop: '4px', pointerEvents: 'none' }}
                />
              </div>
            </Tooltip>
            <div style={{ flex: 1 }}>
              <Tooltip title="Double-click to edit">
                <div 
                  style={{ 
                    padding: '8px',
                    background: isPaliSelected ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
                    borderRadius: '4px',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  {renderTextWithType(row.paliText, row.paliType, row.paliTypename)}
                </div>
              </Tooltip>
              {(row.paliTags && row.paliTags.length > 0) && (
                <div style={{ marginTop: '4px' }}>
                  {row.paliTags.map((tag, i) => (
                    <Tooltip key={i} title="Click to edit tags">
                      <Tag 
                        color="blue" 
                        style={{ 
                          fontSize: '10px', 
                          marginRight: '4px', 
                          marginBottom: '2px',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickEditPali?.();
                        }}
                      >
                        {tag}
                      </Tag>
                    </Tooltip>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '4px' }}>
                {row.paliType && (
                  <Tooltip title="Click to edit type">
                    <Tag 
                      color="purple" 
                      style={{ 
                        fontSize: '10px', 
                        marginRight: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickEditPali?.();
                      }}
                    >
                      Type: {row.paliType}
                    </Tag>
                  </Tooltip>
                )}
                {row.paliTypename && (
                  <Tooltip title="Click to edit typename">
                    <Tag 
                      color="orange" 
                      style={{ 
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickEditPali?.();
                      }}
                    >
                      {row.paliTypename}
                    </Tag>
                  </Tooltip>
                )}
              </div>
            </div>
          </Space>
        </Col>
        
        {/* Action Column */}
        <Col xs={24} md={2} style={{ textAlign: 'center' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              #{index + 1}
            </Text>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={onEdit}
              type="primary"
              style={{ width: '100%' }}
            >
              Edit
            </Button>
          </Space>
        </Col>
        
        {/* Kannada Column */}
        <Col xs={24} md={11}>
          <Space align="start" style={{ width: '100%' }} size="middle">
            <Tooltip title="Click: Select | Shift+Click: Select both">
              <div onClick={handleKannadaCheckboxClick} style={{ cursor: 'pointer', display: 'inline-block' }}>
                <Checkbox
                  checked={isKannadaSelected}
                  style={{ marginTop: '4px', pointerEvents: 'none' }}
                />
              </div>
            </Tooltip>
            <div style={{ flex: 1 }}>
              <Tooltip title="Double-click to edit">
                <div 
                  style={{ 
                    padding: '8px',
                    background: isKannadaSelected ? 'rgba(82, 196, 26, 0.1)' : 'transparent',
                    borderRadius: '4px',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  {renderTextWithType(row.kannadaText, row.kannadaType, row.kannadaTypename)}
                </div>
              </Tooltip>
              {(row.kannadaTags && row.kannadaTags.length > 0) && (
                <div style={{ marginTop: '4px' }}>
                  {row.kannadaTags.map((tag, i) => (
                    <Tooltip key={i} title="Click to edit tags">
                      <Tag 
                        color="green" 
                        style={{ 
                          fontSize: '10px', 
                          marginRight: '4px', 
                          marginBottom: '2px',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickEditKannada?.();
                        }}
                      >
                        {tag}
                      </Tag>
                    </Tooltip>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '4px' }}>
                {row.kannadaType && (
                  <Tooltip title="Click to edit type">
                    <Tag 
                      color="purple" 
                      style={{ 
                        fontSize: '10px', 
                        marginRight: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickEditKannada?.();
                      }}
                    >
                      Type: {row.kannadaType}
                    </Tag>
                  </Tooltip>
                )}
                {row.kannadaTypename && (
                  <Tooltip title="Click to edit typename">
                    <Tag 
                      color="orange" 
                      style={{ 
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickEditKannada?.();
                      }}
                    >
                      {row.kannadaTypename}
                    </Tag>
                  </Tooltip>
                )}
              </div>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};