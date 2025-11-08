import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Modal, Space, Divider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ContentRow } from '../types';

const { Title, Text } = Typography;

interface FooterProps {
  contentRows: ContentRow[];
  historyCount: number;
}

export const Footer: React.FC<FooterProps> = ({ contentRows, historyCount }) => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  // ✅ Detect if user is on Mac
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? 'Cmd' : 'Ctrl';

  if (contentRows.length === 0) return null;

  const taggedCount = contentRows.filter(row => 
    (row.paliTags && row.paliTags.length > 0) || 
    (row.kannadaTags && row.kannadaTags.length > 0)
  ).length;

  return (
    <>
      <Card 
        style={{ 
          marginTop: '24px',
          background: '#1a1a1a',
          borderColor: '#303030'
        }}
        styles={{ body: { padding: '16px' } }}
      >
        <Row gutter={16} align="middle">
          <Col xs={24} sm={6}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                {contentRows.length}
              </Title>
              <Text type="secondary">Total Rows</Text>
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                {historyCount}
              </Title>
              <Text type="secondary">History States</Text>
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                {taggedCount}
              </Title>
              <Text type="secondary">Tagged Rows</Text>
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <Button
                icon={<QuestionCircleOutlined />}
                onClick={() => setShowShortcuts(true)}
                type="dashed"
                style={{ borderColor: '#00b3a4', color: '#00b3a4' }}
              >
                Keyboard Shortcuts
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Modal
        title={
          <Space>
            <QuestionCircleOutlined style={{ color: '#00b3a4' }} /> 
            Keyboard Shortcuts {isMac ? '(Mac)' : '(Windows/Linux)'}
          </Space>
        }
        open={showShortcuts}
        onCancel={() => setShowShortcuts(false)}
        footer={null}
        width={800}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Title level={5} style={{ color: '#1890ff' }}>General</Title>
            <Text>• <kbd>F9</kbd> - Toggle Focus Mode</Text><br />
            <Text>• <kbd>{modKey}+S</kbd> - Save progress</Text><br />
            <Text>• <kbd>{modKey}+Z</kbd> - Undo</Text><br />
            <Text>• <kbd>{modKey}+Shift+Z</kbd> or <kbd>{modKey}+Y</kbd> - Redo</Text>
            <Text>• <kbd>Esc</kbd> - Clear all selections</Text>
          </div>

          <Divider />

          <div>
            <Title level={5} style={{ color: '#faad14' }}>Context-Aware (works on selected column)</Title>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              These shortcuts work on whichever column you have selected
            </Text>
            <Text>• <kbd>{modKey}+M</kbd> - Merge selected rows</Text><br />
            <Text>• <kbd>{modKey}+D</kbd> - Delete content</Text><br />
            <Text>• <kbd>{modKey}+T</kbd> - Add tags/type</Text><br />
            <Text>• <kbd>{modKey}+E</kbd> - Export both columns</Text>
          </div>

          <Divider />

          <div>
            <Title level={5} style={{ color: '#1890ff' }}>Pali Column Only</Title>
            <Text>• <kbd>{modKey}+Shift+M</kbd> - Merge Pali rows</Text><br />
            <Text>• <kbd>{modKey}+Shift+D</kbd> - Delete Pali content</Text><br />
            <Text>• <kbd>{modKey}+Shift+T</kbd> - Add Pali tags/type</Text><br />
            <Text>• <kbd>{modKey}+Shift+P</kbd> - Export Pali only</Text>
            <Text>• <kbd>{modKey}+Shift+C</kbd> - Clear Pali selection</Text>
          </div>

          <Divider />

          <div>
            <Title level={5} style={{ color: '#52c41a' }}>Kannada Column Only</Title>
            <Text>• <kbd>{modKey}+Shift+K</kbd> - Merge Kannada rows</Text><br />
            <Text>• <kbd>{modKey}+Shift+X</kbd> - Delete Kannada content</Text><br />
            <Text>• <kbd>{modKey}+Shift+G</kbd> - Add Kannada tags/type</Text><br />
            <Text>• <kbd>{modKey}+Shift+L</kbd> - Export Kannada only</Text>
            <Text>• <kbd>{modKey}+Shift+N</kbd> - Clear Kannada selection</Text>
          </div>

          <Divider />

          <div>
            <Title level={5} style={{ color: '#ff4d4f' }}>Danger Zone</Title>
            <Text>• <kbd>{modKey}+Shift+Backspace</kbd> - Delete entire selected rows</Text><br />
            <Text>• <kbd>{modKey}+Shift+Delete</kbd> - Clear all data</Text>
          </div>

          <Divider />

          <div style={{ 
            padding: '12px', 
            background: '#1f1f1f', 
            borderRadius: '6px',
            borderLeft: '3px solid #00b3a4'
          }}>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <strong>💡 Tips:</strong>
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                • Use simple shortcuts (<kbd>{modKey}+M</kbd>, <kbd>{modKey}+D</kbd>, <kbd>{modKey}+T</kbd>) when working with one column
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                • Use specific shortcuts (<kbd>{modKey}+Shift+...</kbd>) when both columns are selected
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                • Shortcuts won&apos;t work when typing in input fields or textareas
              </Text>
            </Space>
          </div>
        </Space>
      </Modal>
    </>
  );
};