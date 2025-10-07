import React from 'react';
import { Card, Row, Col, Space, Checkbox, Tag, Typography, Tooltip } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import type { ContentRow as ContentRowType } from '../types';
import { renderTextWithType } from '../utils/textRenderer';

const { Text } = Typography;

interface ContentRowProps {
  row: ContentRowType;
  index: number;
  isPaliSelected: boolean;
  isKannadaSelected: boolean;
  onPaliCheckboxChange: () => void;
  onKannadaCheckboxChange: () => void;
  onEditPali: () => void;
  onEditKannada: () => void;
  onOpenPaliTagModal: () => void;
  onOpenKannadaTagModal: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  row,
  index,
  isPaliSelected,
  isKannadaSelected,
  onPaliCheckboxChange,
  onKannadaCheckboxChange,
  onEditPali,
  onEditKannada,
  onOpenPaliTagModal,
  onOpenKannadaTagModal,
}) => {
  const isAnySelected = isPaliSelected || isKannadaSelected;

  return (
    <Card 
      key={row.id}
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
        <Col xs={24} md={12}>
          <Space 
            align="start" 
            style={{ width: '100%' }}
            size="middle"
          >
            <Checkbox
              checked={isPaliSelected}
              onChange={onPaliCheckboxChange}
              style={{ marginTop: '4px' }}
            />
            <Tooltip title="Click to edit text">
              <div 
                className="clickable-content"
                style={{ 
                  flex: 1,
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                }}
                onClick={onEditPali}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(24, 144, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
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
                
                {/* Clickable Metadata Section */}
                {((row.paliTags && row.paliTags.length > 0) || row.paliType || row.paliTypename) && (
                  <div 
                    style={{ 
                      marginTop: '4px', 
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent onClick
                      onOpenPaliTagModal();
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(24, 144, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {(row.paliTags && row.paliTags.length > 0) && (
                      <div style={{ marginBottom: '2px' }}>
                        {row.paliTags.map((tag, i) => (
                          <Tag 
                            key={i} 
                            color="blue" 
                            icon={<TagOutlined />}
                            style={{ fontSize: '10px', marginRight: '4px', marginBottom: '2px' }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    )}
                    {row.paliType && (
                      <Tag color="purple" style={{ fontSize: '10px', marginRight: '4px', marginTop: '2px' }}>
                        Type: {row.paliType}
                      </Tag>
                    )}
                    {row.paliTypename && (
                      <Tag color="orange" style={{ fontSize: '10px', marginTop: '2px' }}>
                        {row.paliTypename}
                      </Tag>
                    )}
                  </div>
                )}
              </div>
            </Tooltip>
          </Space>
        </Col>
        
        {/* Kannada Column */}
        <Col xs={24} md={12}>
          <Space 
            align="start" 
            style={{ width: '100%' }}
            size="middle"
          >
            <Checkbox
              checked={isKannadaSelected}
              onChange={onKannadaCheckboxChange}
              style={{ marginTop: '4px' }}
            />
            <Tooltip title="Click to edit text">
              <div 
                style={{ 
                  flex: 1,
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                }}
                onClick={onEditKannada}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(82, 196, 26, 0.08)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
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
                
                {/* Clickable Metadata Section */}
                {((row.kannadaTags && row.kannadaTags.length > 0) || row.kannadaType || row.kannadaTypename) && (
                  <div 
                    style={{ 
                      marginTop: '4px', 
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent onClick
                      onOpenKannadaTagModal();
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(82, 196, 26, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {(row.kannadaTags && row.kannadaTags.length > 0) && (
                      <div style={{ marginBottom: '2px' }}>
                        {row.kannadaTags.map((tag, i) => (
                          <Tag 
                            key={i} 
                            color="green" 
                            icon={<TagOutlined />}
                            style={{ fontSize: '10px', marginRight: '4px', marginBottom: '2px' }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    )}
                    {row.kannadaType && (
                      <Tag color="purple" style={{ fontSize: '10px', marginRight: '4px', marginTop: '2px' }}>
                        Type: {row.kannadaType}
                      </Tag>
                    )}
                    {row.kannadaTypename && (
                      <Tag color="orange" style={{ fontSize: '10px', marginTop: '2px' }}>
                        {row.kannadaTypename}
                      </Tag>
                    )}
                  </div>
                )}
              </div>
            </Tooltip>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};