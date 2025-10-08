import React from 'react';
import { Card, Row, Col, Space, Checkbox, Button, Tag, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ContentRow as ContentRowType } from '../types';
import { renderTextWithType } from '../utils/textRenderer';

const { Text } = Typography;

interface ContentRowProps {
  row: ContentRowType;
  index: number;
  isPaliSelected: boolean;
  isKannadaSelected: boolean;
  onPaliCheck: () => void;
  onKannadaCheck: () => void;
  onEdit: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  row,
  index,
  isPaliSelected,
  isKannadaSelected,
  onPaliCheck,
  onKannadaCheck,
  onEdit,
}) => {
  const isAnySelected = isPaliSelected || isKannadaSelected;

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
            <Checkbox
              checked={isPaliSelected}
              onChange={onPaliCheck}
              style={{ marginTop: '4px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                padding: '8px',
                background: isPaliSelected ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
                borderRadius: '4px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {renderTextWithType(row.paliText, row.paliType, row.paliTypename)}
              </div>
              {(row.paliTags && row.paliTags.length > 0) && (
                <div style={{ marginTop: '4px' }}>
                  {row.paliTags.map((tag, i) => (
                    <Tag key={i} color="blue" style={{ fontSize: '10px', marginRight: '4px', marginBottom: '2px' }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
              {row.paliType && (
                <Tag color="purple" style={{ fontSize: '10px', marginTop: '4px' }}>
                  Type: {row.paliType}
                </Tag>
              )}
              {row.paliTypename && (
                <Tag color="orange" style={{ fontSize: '10px', marginTop: '4px' }}>
                  {row.paliTypename}
                </Tag>
              )}
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
            <Checkbox
              checked={isKannadaSelected}
              onChange={onKannadaCheck}
              style={{ marginTop: '4px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                padding: '8px',
                background: isKannadaSelected ? 'rgba(82, 196, 26, 0.1)' : 'transparent',
                borderRadius: '4px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {renderTextWithType(row.kannadaText, row.kannadaType, row.kannadaTypename)}
              </div>
              {(row.kannadaTags && row.kannadaTags.length > 0) && (
                <div style={{ marginTop: '4px' }}>
                  {row.kannadaTags.map((tag, i) => (
                    <Tag key={i} color="green" style={{ fontSize: '10px', marginRight: '4px', marginBottom: '2px' }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
              {row.kannadaType && (
                <Tag color="purple" style={{ fontSize: '10px', marginTop: '4px' }}>
                  Type: {row.kannadaType}
                </Tag>
              )}
              {row.kannadaTypename && (
                <Tag color="orange" style={{ fontSize: '10px', marginTop: '4px' }}>
                  {row.kannadaTypename}
                </Tag>
              )}
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};