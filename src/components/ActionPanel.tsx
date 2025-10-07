import React from 'react';
import { Row, Col, Card, Space, Button, Badge, Typography } from 'antd';
import {
  MergeCellsOutlined,
  DeleteOutlined,
  TagsOutlined,
  CloseCircleOutlined,
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
  onDeleteEntireRows: () => void;
  onClearPaliSelection: () => void;
  onClearKannadaSelection: () => void;
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
  onDeleteEntireRows,
  onClearPaliSelection,
  onClearKannadaSelection,
}) => {
  const hasBothSelection = hasPaliSelection && hasKannadaSelection;

  if (!hasPaliSelection && !hasKannadaSelection) return null;

  return (
    <Row gutter={16} style={{ marginBottom: '16px' }}>
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
              <Button 
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={onClearPaliSelection}
              >
                Clear
              </Button>
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
              {hasBothSelection && (
                <Button 
                  icon={<DeleteOutlined />}
                  danger
                  onClick={onDeleteEntireRows}
                  type="primary"
                >
                  Delete Entire Rows
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      )}

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
              <Button 
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={onClearKannadaSelection}
              >
                Clear
              </Button>
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
              {hasBothSelection && (
                <Button 
                  icon={<DeleteOutlined />}
                  danger
                  onClick={onDeleteEntireRows}
                  type="primary"
                >
                  Delete Entire Rows
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      )}
    </Row>
  );
};