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
  
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? 'Cmd' : 'Ctrl';

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
        width={900}
        style={{ top: 20 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          }
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* General & Clear Shortcuts */}
          <div>
            <Title level={5} style={{ color: '#1890ff' }}>General & Clear Shortcuts</Title>
            <Text>• <kbd>F9</kbd> - Toggle Focus Mode</Text><br />
            <Text>• <kbd>{modKey}+S</kbd> - Save progress</Text><br />
            <Text>• <kbd>{modKey}+Z</kbd> - Undo</Text><br />
            <Text>• <kbd>{modKey}+Shift+Z</kbd> or <kbd>{modKey}+Y</kbd> - Redo</Text><br />
            <Divider style={{ margin: '12px 0' }} />
            <Text strong style={{ color: '#faad14' }}>Clear Selections:</Text><br />
            <div style={{ 
              padding: '12px', 
              background: '#1f1f1f', 
              borderRadius: '4px',
              marginTop: '8px',
              borderLeft: '3px solid #faad14'
            }}>
              <Text>• <kbd>{modKey}+Shift+C</kbd> - Clear <strong>all</strong> selections (both columns)</Text><br />
              <Text>• <kbd>{modKey}+Shift+[</kbd> - Clear <strong>Pali</strong> selection only (left bracket)</Text><br />
              <Text>• <kbd>{modKey}+Shift+]</kbd> - Clear <strong>Kannada</strong> selection only (right bracket)</Text>
              <div style={{ 
                marginTop: '8px', 
                padding: '6px', 
                background: '#2a1f0a', 
                borderRadius: '3px' 
              }}>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  💡 <strong>Mnemonic:</strong> Left bracket <kbd>[</kbd> = Left column (Pali), Right bracket <kbd>]</kbd> = Right column (Kannada)
                </Text>
              </div>
            </div>
          </div>

          <Divider />

          {/* Selection Shortcuts */}
          <div>
            <Title level={5} style={{ color: '#faad14' }}>Selection Shortcuts ⭐ NEW!</Title>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Powerful selection methods for efficient workflow
            </Text>
            <div style={{ 
              padding: '12px', 
              background: '#1f1f1f', 
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <Text>• <strong>Click checkbox</strong> - Select single column</Text><br />
              <Text>• <strong>Shift+Click checkbox</strong> - Select range (e.g., rows 5-35)</Text><br />
              <Text>• <strong>Alt+Click checkbox</strong> - Select both Pali & Kannada for that row</Text><br />
              <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                • <strong>Alt+Click row 5 → Shift+Click row 35</strong> - Select BOTH columns for rows 5-35! 🎯
              </Text><br />
              <Text>• <strong>Double-click text</strong> - Open edit modal</Text><br />
              <Text>• <strong>Click tag/type</strong> - Quick edit metadata</Text>
            </div>
            <div style={{ 
              padding: '8px', 
              background: '#2a1f0a', 
              borderRadius: '4px',
              borderLeft: '3px solid #faad14'
            }}>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                💡 <strong>Pro Tip:</strong> Use Alt+Click to start selecting both columns, then Shift+Click to extend the range. This saves you from repeating the selection process!
              </Text>
            </div>
          </div>

          <Divider />

          {/* Bulk Operations */}
          <div>
            <Title level={5} style={{ color: '#faad14' }}>Bulk Operations ⭐ NEW!</Title>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Work with both columns simultaneously
            </Text>
            <Text>• <kbd>{modKey}+Shift+B</kbd> - Add tags/type to BOTH columns at once</Text><br />
            <Text>• <kbd>{modKey}+Shift+C</kbd> - Clear all selections (unified)</Text><br />
            <Text>• <kbd>{modKey}+Shift+Backspace</kbd> - Delete entire rows</Text>
            <div style={{ 
              padding: '8px', 
              background: '#1a2e1a', 
              borderRadius: '4px',
              borderLeft: '3px solid #52c41a',
              marginTop: '8px'
            }}>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                💡 <strong>Use Case:</strong> Select rows 5-35 in both columns → Press {modKey}+Shift+B → Add same tags to both Pali and Kannada!
              </Text>
            </div>
          </div>

          <Divider />

          {/* Context-Aware Shortcuts */}
          <div>
            <Title level={5} style={{ color: '#faad14' }}>Context-Aware Shortcuts</Title>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              These shortcuts work on whichever column you have selected
            </Text>
            <Text>• <kbd>{modKey}+M</kbd> - Merge selected rows</Text><br />
            <Text>• <kbd>{modKey}+D</kbd> - Delete content</Text><br />
            <Text>• <kbd>{modKey}+T</kbd> - Add tags/type</Text><br />
            <Text>• <kbd>{modKey}+E</kbd> - Export both columns</Text>
          </div>

          <Divider />

          {/* Pali Column Only */}
          <div>
            <Title level={5} style={{ color: '#1890ff' }}>Pali Column Only</Title>
            <div style={{ 
              padding: '12px', 
              background: '#0d1b2a', 
              borderRadius: '6px',
              borderLeft: '3px solid #1890ff'
            }}>
              <Text>• <kbd>{modKey}+Shift+M</kbd> - Merge Pali rows</Text><br />
              <Text>• <kbd>{modKey}+Shift+D</kbd> - Delete Pali content</Text><br />
              <Text>• <kbd>{modKey}+Shift+T</kbd> - Add Pali tags/type</Text><br />
              <Text>• <kbd>{modKey}+Shift+P</kbd> - Export Pali only</Text><br />
              <Text>• <kbd>{modKey}+Shift+[</kbd> - Clear Pali selection (left bracket)</Text>
            </div>
          </div>

          <Divider />

          {/* Kannada Column Only */}
          <div>
            <Title level={5} style={{ color: '#52c41a' }}>Kannada Column Only</Title>
            <div style={{ 
              padding: '12px', 
              background: '#0a1f0a', 
              borderRadius: '6px',
              borderLeft: '3px solid #52c41a'
            }}>
              <Text>• <kbd>{modKey}+Shift+K</kbd> - Merge Kannada rows</Text><br />
              <Text>• <kbd>{modKey}+Shift+X</kbd> - Delete Kannada content</Text><br />
              <Text>• <kbd>{modKey}+Shift+G</kbd> - Add Kannada tags/type</Text><br />
              <Text>• <kbd>{modKey}+Shift+L</kbd> - Export Kannada only</Text><br />
              <Text>• <kbd>{modKey}+Shift+]</kbd> - Clear Kannada selection (right bracket)</Text>
            </div>
          </div>

          <Divider />

          {/* Export Shortcuts */}
          <div>
            <Title level={5} style={{ color: '#00b3a4' }}>Export Shortcuts</Title>
            <Text>• <kbd>{modKey}+E</kbd> - Export both columns</Text><br />
            <Text>• <kbd>{modKey}+Shift+P</kbd> - Export Pali only</Text><br />
            <Text>• <kbd>{modKey}+Shift+L</kbd> - Export Kannada only</Text>
          </div>

          <Divider />

          {/* Danger Zone */}
          <div>
            <Title level={5} style={{ color: '#ff4d4f' }}>Danger Zone</Title>
            <div style={{ 
              padding: '12px', 
              background: '#2a1215', 
              borderRadius: '6px',
              border: '1px solid #ff4d4f'
            }}>
              <Text>• <kbd>{modKey}+Shift+Backspace</kbd> - Delete entire selected rows</Text><br />
              <Text>• <kbd>{modKey}+Shift+Delete</kbd> - Clear all data</Text>
            </div>
          </div>

          <Divider />

          {/* Edit Modal Shortcuts */}
          <div>
            <Title level={5} style={{ color: '#00b3a4' }}>Edit Modal Shortcuts</Title>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              When editing in the modal
            </Text>
            <Text>• <kbd>Ctrl+Shift+↑/↓</kbd> - Navigate Pali rows</Text><br />
            <Text>• <kbd>Alt+↑/↓</kbd> - Navigate Kannada rows</Text><br />
            <Text>• <kbd>Alt+Ctrl+↑/↓</kbd> - Navigate both together</Text><br />
            <Text>• <kbd>F11</kbd> - Toggle fullscreen mode</Text>
          </div>

          <Divider />

          {/* Tips & Tricks */}
          <div style={{ 
            padding: '16px', 
            background: '#1f1f1f', 
            borderRadius: '6px',
            borderLeft: '4px solid #00b3a4'
          }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary">
                <strong>💡 Workflow Tips:</strong>
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                1. <strong>Quick Range Select Both Columns:</strong> Alt+Click row 5 → Shift+Click row 35 → Both columns selected!
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                2. <strong>Bulk Tagging:</strong> Select multiple rows → {modKey}+Shift+B → Apply same tags to both languages
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                3. <strong>Clear Specific Column:</strong> {modKey}+Shift+[ clears only Pali, {modKey}+Shift+] clears only Kannada
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                4. <strong>Remember Brackets:</strong> Left bracket <kbd>[</kbd> = Left column (Pali), Right bracket <kbd>]</kbd> = Right column (Kannada)
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                5. <strong>Context-Aware:</strong> Use simple shortcuts ({modKey}+M, {modKey}+D, {modKey}+T) when working with one column
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                6. <strong>Specific Actions:</strong> Use {modKey}+Shift+... shortcuts when both columns are selected but you want to target one
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                7. <strong>Important:</strong> Shortcuts won&apos;t work when typing in input fields or textareas
              </Text>
            </Space>
          </div>

          <Divider />

          {/* Quick Reference Card */}
          <div style={{ 
            padding: '16px', 
            background: 'linear-gradient(135deg, #1a1c21 0%, #2a1f0a 100%)', 
            borderRadius: '8px',
            border: '2px solid #faad14'
          }}>
            <Title level={5} style={{ color: '#faad14', marginBottom: '12px' }}>
              🚀 Most Powerful Shortcuts
            </Title>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <div style={{ 
                  padding: '8px', 
                  background: '#0d1b2a', 
                  borderRadius: '4px',
                  borderLeft: '3px solid #1890ff'
                }}>
                  <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
                    Alt+Click → Shift+Click
                  </Text><br />
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Range select both columns
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ 
                  padding: '8px', 
                  background: '#2a1f0a', 
                  borderRadius: '4px',
                  borderLeft: '3px solid #faad14'
                }}>
                  <Text strong style={{ color: '#faad14', fontSize: '12px' }}>
                    {modKey}+Shift+B
                  </Text><br />
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Bulk tag both columns
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ 
                  padding: '8px', 
                  background: '#0a1f0a', 
                  borderRadius: '4px',
                  borderLeft: '3px solid #52c41a'
                }}>
                  <Text strong style={{ color: '#52c41a', fontSize: '12px' }}>
                    {modKey}+Shift+[ / ]
                  </Text><br />
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Clear individual columns
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ 
                  padding: '8px', 
                  background: '#1a1a1a', 
                  borderRadius: '4px',
                  borderLeft: '3px solid #00b3a4'
                }}>
                  <Text strong style={{ color: '#00b3a4', fontSize: '12px' }}>
                    Shift+Click
                  </Text><br />
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Range select (rows 5-35)
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Clear Shortcuts Summary */}
          <div style={{ 
            padding: '12px', 
            background: '#1a1c21', 
            borderRadius: '6px',
            border: '1px solid #faad14'
          }}>
            <Title level={5} style={{ color: '#faad14', marginBottom: '8px' }}>
              📌 Clear Shortcuts Quick Reference
            </Title>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text><kbd>{modKey}+Shift+C</kbd></Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Clear ALL selections</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text><kbd>{modKey}+Shift+[</kbd></Text>
                    <Text type="secondary" style={{ fontSize: '12px', color: '#1890ff' }}>Clear Pali only (left bracket)</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text><kbd>{modKey}+Shift+]</kbd></Text>
                    <Text type="secondary" style={{ fontSize: '12px', color: '#52c41a' }}>Clear Kannada only (right bracket)</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </div>
        </Space>
      </Modal>
    </>
  );
};