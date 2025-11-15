import React from 'react';
import { Row, Col, Space, Checkbox, Tag, Typography, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ContentRow as ContentRowType } from '../types';
import { renderTextWithType } from '../utils/textRenderer';

const { Text } = Typography;

interface ContentRowProps {
  row: ContentRowType;
  index: number;
  isPaliSelected: boolean;
  isKannadaSelected: boolean;
  onPaliCheck: (selectBoth?: boolean, isShiftClick?: boolean) => void;
  onKannadaCheck: (selectBoth?: boolean, isShiftClick?: boolean) => void;
  onEdit: () => void;
  onQuickEditPali?: () => void;
  onQuickEditKannada?: () => void;
  fontSize?: number;
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
  fontSize = 100,
}) => {
  const isAnySelected = isPaliSelected || isKannadaSelected;
  const fontScale = fontSize / 100;

  const handlePaliCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isShiftClick = e.shiftKey;
    const isAltClick = e.altKey;
    
    if (isAltClick) {
      // Alt+Click: Select both columns
      e.preventDefault();
      onPaliCheck(true, false);
      return;
    }
    
    if (isShiftClick) {
      // Shift+Click: Range selection
      e.preventDefault();
      onPaliCheck(false, true);
      return;
    }
    
    // Normal click
    onPaliCheck(false, false);
  };

  const handleKannadaCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isShiftClick = e.shiftKey;
    const isAltClick = e.altKey;
    
    if (isAltClick) {
      // Alt+Click: Select both columns
      e.preventDefault();
      onKannadaCheck(true, false);
      return;
    }
    
    if (isShiftClick) {
      // Shift+Click: Range selection
      e.preventDefault();
      onKannadaCheck(false, true);
      return;
    }
    
    // Normal click
    onKannadaCheck(false, false);
  };

  return (
    <div
      style={{
        backgroundColor: isAnySelected ? '#2a2a2a' : '#1f1f1f',
        borderBottom: '1px solid #303030',
        borderLeft: isAnySelected ? '2px solid #1890ff' : '2px solid transparent',
        transition: 'all 0.2s ease',
        padding: `${6 * fontScale}px ${12 * fontScale}px`,
      }}
    >
      <Row gutter={8 * fontScale} align="top">
        {/* Pali Column */}
        <Col xs={24} md={11}>
          <Space align="start" style={{ width: '100%' }} size="small">
            <Tooltip title="Click: Select | Shift+Click: Range | Alt+Click: Both columns">
              <div onClick={handlePaliCheckboxClick} style={{ cursor: 'pointer', paddingTop: `${2 * fontScale}px` }}>
                <Checkbox
                  checked={isPaliSelected}
                  style={{ 
                    pointerEvents: 'none',
                    transform: `scale(${fontScale})`,
                    transformOrigin: 'top left'
                  }}
                />
              </div>
            </Tooltip>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Pali Text */}
              <Tooltip title="Double-click to edit">
                <div
                  style={{
                    padding: `${2 * fontScale}px ${4 * fontScale}px`,
                    background: isPaliSelected ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    wordBreak: 'break-word'
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  {renderTextWithType(row.paliText, row.paliType, row.paliTypename, fontScale)}
                </div>
              </Tooltip>

              {/* Pali Metadata Row */}
              {(row.paliTags?.length || row.paliType || row.paliTypename) && (
                <div style={{ 
                  marginTop: `${3 * fontScale}px`, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: `${3 * fontScale}px`, 
                  alignItems: 'center' 
                }}>
                  {/* Pali Tags */}
                  {row.paliTags?.map((tag, i) => (
                    <Tooltip key={i} title="Click to edit tags">
                      <Tag
                        color="blue"
                        style={{
                          fontSize: `${10 * fontScale}px`,
                          padding: `0 ${4 * fontScale}px`,
                          margin: 0,
                          lineHeight: `${16 * fontScale}px`,
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

                  {/* Pali Type */}
                  {row.paliType && (
                    <Tooltip title="Click to edit type">
                      <Tag
                        color="purple"
                        style={{
                          fontSize: `${9 * fontScale}px`,
                          padding: `0 ${3 * fontScale}px`,
                          margin: 0,
                          lineHeight: `${14 * fontScale}px`,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickEditPali?.();
                        }}
                      >
                        {row.paliType}
                      </Tag>
                    </Tooltip>
                  )}

                  {/* Pali Typename */}
                  {row.paliTypename && (
                    <Tooltip title="Click to edit typename">
                      <Tag
                        color="orange"
                        style={{
                          fontSize: `${9 * fontScale}px`,
                          padding: `0 ${3 * fontScale}px`,
                          margin: 0,
                          lineHeight: `${14 * fontScale}px`,
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
              )}
            </div>
          </Space>
        </Col>

        {/* Action Column */}
        <Col xs={24} md={2} style={{ textAlign: 'center', padding: `${2 * fontScale}px 0` }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: `${4 * fontScale}px` 
          }}>
            <Text type="secondary" style={{ 
              fontSize: `${10 * fontScale}px`, 
              lineHeight: `${14 * fontScale}px` 
            }}>
              #{index + 1}
            </Text>
            
            <Tooltip title="Edit row">
              <EditOutlined
                onClick={onEdit}
                style={{
                  fontSize: `${16 * fontScale}px`,
                  color: '#1890ff',
                  cursor: 'pointer',
                  padding: `${4 * fontScale}px`,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.color = '#40a9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = '#1890ff';
                }}
              />
            </Tooltip>
          </div>
        </Col>

        {/* Kannada Column */}
        <Col xs={24} md={11}>
          <Space align="start" style={{ width: '100%' }} size="small">
            <Tooltip title="Click: Select | Shift+Click: Range | Alt+Click: Both columns">
              <div onClick={handleKannadaCheckboxClick} style={{ cursor: 'pointer', paddingTop: `${2 * fontScale}px` }}>
                <Checkbox
                  checked={isKannadaSelected}
                  style={{ 
                    pointerEvents: 'none',
                    transform: `scale(${fontScale})`,
                    transformOrigin: 'top left'
                  }}
                />
              </div>
            </Tooltip>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Kannada Text */}
              <Tooltip title="Double-click to edit">
                <div
                  style={{
                    padding: `${2 * fontScale}px ${4 * fontScale}px`,
                    background: isKannadaSelected ? 'rgba(82, 196, 26, 0.1)' : 'transparent',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    wordBreak: 'break-word'
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  {renderTextWithType(row.kannadaText, row.kannadaType, row.kannadaTypename, fontScale)}
                </div>
              </Tooltip>

              {/* Kannada Metadata Row */}
              {(row.kannadaTags?.length || row.kannadaType || row.kannadaTypename) && (
                <div style={{ 
                  marginTop: `${3 * fontScale}px`, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: `${3 * fontScale}px`, 
                  alignItems: 'center' 
                }}>
                  {/* Kannada Tags */}
                  {row.kannadaTags?.map((tag, i) => (
                    <Tooltip key={i} title="Click to edit tags">
                      <Tag
                        color="green"
                        style={{
                          fontSize: `${10 * fontScale}px`,
                          padding: `0 ${4 * fontScale}px`,
                          margin: 0,
                          lineHeight: `${16 * fontScale}px`,
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

                  {/* Kannada Type */}
                  {row.kannadaType && (
                    <Tooltip title="Click to edit type">
                      <Tag
                        color="purple"
                        style={{
                          fontSize: `${9 * fontScale}px`,
                          padding: `0 ${3 * fontScale}px`,
                          margin: 0,
                          lineHeight: `${14 * fontScale}px`,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickEditKannada?.();
                        }}
                      >
                        {row.kannadaType}
                      </Tag>
                    </Tooltip>
                  )}

                  {/* Kannada Typename */}
                  {row.kannadaTypename && (
                    <Tooltip title="Click to edit typename">
                      <Tag
                        color="orange"
                        style={{
                          fontSize: `${9 * fontScale}px`,
                          padding: `0 ${3 * fontScale}px`,
                          margin: 0,
                          lineHeight: `${14 * fontScale}px`,
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
              )}
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};