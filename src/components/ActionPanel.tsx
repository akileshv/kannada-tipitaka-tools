import React from 'react';
import { Row, Col, Card, Space, Button, Badge, Typography, Tooltip } from 'antd';
import {
  MergeCellsOutlined,
  DeleteOutlined,
  TagsOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface ActionPanelProps {
  hasPaliSelection: boolean;
  hasKannadaSelection: boolean;
  selectedPaliCount: number;
  selectedKannadaCount: number;
  onMergePali: () => void;
  onMergeKannada: () => void;
  onDeletePaliContent: () => void;
  onDeleteKannadaContent: () => void;
  onAddPaliTags: () => void;
  onAddKannadaTags: () => void;
  onAddBothTags: () => void;
  onDeleteEntireRows: () => void;
  onClearPaliSelection: () => void;
  onClearKannadaSelection: () => void;
  onClearAllSelections: () => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  hasPaliSelection,
  hasKannadaSelection,
  selectedPaliCount,
  selectedKannadaCount,
  onMergePali,
  onMergeKannada,
  onDeletePaliContent,
  onDeleteKannadaContent,
  onAddPaliTags,
  onAddKannadaTags,
  onAddBothTags,
  onDeleteEntireRows,
  onClearPaliSelection,
  onClearKannadaSelection,
  onClearAllSelections,
}) => {
  const hasBothSelection = hasPaliSelection && hasKannadaSelection;
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? 'Cmd' : 'Ctrl';

  if (!hasPaliSelection && !hasKannadaSelection) return null;

  return (
    <>
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        {/* Pali Column Card */}
        {hasPaliSelection && (
          <Col xs={24} md={hasBothSelection ? 12 : 24}>
            <Card 
              style={{ 
                marginBottom: '0', 
                backgroundColor: '#0d1b2a', 
                borderColor: '#1890ff',
                borderWidth: '2px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
                height: '100%'
              }}
              title={
                <Space>
                  <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    Pali Column Actions
                  </Text>
                  <Badge count={selectedPaliCount} style={{ backgroundColor: '#1890ff' }} />
                </Space>
              }
              extra={
                <Tooltip title={`Clear Pali selection (${modKey}+Shift+[)`}>
                  <Button 
                    size="small"
                    icon={<CloseCircleOutlined />}
                    onClick={onClearPaliSelection}
                    style={{
                      borderColor: '#1890ff',
                      color: '#1890ff',
                    }}
                  >
                    Clear Pali
                  </Button>
                </Tooltip>
              }
            >
              <Space wrap size="middle">
                <Button 
                  icon={<MergeCellsOutlined />}
                  onClick={onMergePali}
                  disabled={selectedPaliCount < 2}
                  type="primary"
                  style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                  Merge ({selectedPaliCount})
                </Button>
                <Button 
                  icon={<DeleteOutlined />}
                  onClick={onDeletePaliContent}
                  danger
                >
                  Delete Content
                </Button>
                <Button 
                  icon={<TagsOutlined />}
                  onClick={onAddPaliTags}
                  style={{ borderColor: '#1890ff', color: '#1890ff' }}
                >
                  Add Tags/Type
                </Button>
              </Space>
            </Card>
          </Col>
        )}

        {/* Kannada Column Card */}
        {hasKannadaSelection && (
          <Col xs={24} md={hasBothSelection ? 12 : 24}>
            <Card 
              style={{ 
                marginBottom: '0',
                backgroundColor: '#0a1f0a', 
                borderColor: '#52c41a',
                borderWidth: '2px',
                boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)',
                height: '100%'
              }}
              title={
                <Space>
                  <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                    Kannada Column Actions
                  </Text>
                  <Badge count={selectedKannadaCount} style={{ backgroundColor: '#52c41a' }} />
                </Space>
              }
              extra={
                <Tooltip title={`Clear Kannada selection (${modKey}+Shift+])`}>
                  <Button 
                    size="small"
                    icon={<CloseCircleOutlined />}
                    onClick={onClearKannadaSelection}
                    style={{
                      borderColor: '#52c41a',
                      color: '#52c41a',
                    }}
                  >
                    Clear Kannada
                  </Button>
                </Tooltip>
              }
            >
              <Space wrap size="middle">
                <Button 
                  icon={<MergeCellsOutlined />}
                  onClick={onMergeKannada}
                  disabled={selectedKannadaCount < 2}
                  type="primary"
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Merge ({selectedKannadaCount})
                </Button>
                <Button 
                  icon={<DeleteOutlined />}
                  onClick={onDeleteKannadaContent}
                  danger
                >
                  Delete Content
                </Button>
                <Button 
                  icon={<TagsOutlined />}
                  onClick={onAddKannadaTags}
                  style={{ borderColor: '#52c41a', color: '#52c41a' }}
                >
                  Add Tags/Type
                </Button>
              </Space>
            </Card>
          </Col>
        )}
      </Row>

      {/* Bulk Actions Card (Both Columns) */}
      {hasBothSelection && (
        <Card 
          style={{ 
            marginBottom: '16px',
            backgroundColor: '#2a1f0a', 
            borderColor: '#faad14',
            borderWidth: '2px',
            boxShadow: '0 4px 12px rgba(250, 173, 20, 0.15)',
          }}
          title={
            <Space>
              <ThunderboltOutlined style={{ color: '#faad14' }} />
              <Text style={{ color: '#faad14', fontWeight: 'bold' }}>
                Bulk Actions (Both Columns)
              </Text>
              <Badge 
                count={`${selectedPaliCount}P + ${selectedKannadaCount}K`} 
                style={{ backgroundColor: '#faad14' }} 
              />
            </Space>
          }
          extra={
            <Tooltip title={`Clear all selections (${modKey}+Shift+C)`}>
              <Button 
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={onClearAllSelections}
                style={{ borderColor: '#faad14', color: '#faad14' }}
              >
                Clear All
              </Button>
            </Tooltip>
          }
        >
          <Space wrap size="middle">
            <Button 
              icon={<TagsOutlined />}
              onClick={onAddBothTags}
              type="primary"
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            >
              Add Tags/Type to Both ({modKey}+Shift+B)
            </Button>
            <Button 
              icon={<DeleteOutlined />}
              danger
              onClick={onDeleteEntireRows}
              type="primary"
            >
              Delete Entire Rows ({modKey}+Shift+Backspace)
            </Button>
          </Space>
        </Card>
      )}
    </>
  );
};