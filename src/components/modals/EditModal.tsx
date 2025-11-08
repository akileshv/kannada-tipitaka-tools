import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Space, Button, Typography, Divider, Tag, Alert, Row, Col } from 'antd';
import { App as AntApp } from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ContentRow } from '../../types';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface EditModalProps {
  visible: boolean;
  editingRow: ContentRow | null;
  allRows: ContentRow[];
  onClose: () => void;
  onSavePali: (rowId: string, newText: string, otherColumnText: string, otherColumnRowId: string) => void;
  onSaveKannada: (rowId: string, newText: string, otherColumnText: string, otherColumnRowId: string) => void;
  onNavigate: (rowId: string) => void;
  onMergePali: (currentIndex: number, direction: 'prev' | 'next') => void;      // ✅ ADD
  onMergeKannada: (currentIndex: number, direction: 'prev' | 'next') => void;   // ✅ ADD
}

export const EditModal: React.FC<EditModalProps> = ({
  visible,
  editingRow,
  allRows,
  onClose,
  onSavePali,
  onSaveKannada,
  onMergePali,
  onMergeKannada,
}) => {

  const [currentPaliIndex, setCurrentPaliIndex] = useState<number>(0);
  const [currentKannadaIndex, setCurrentKannadaIndex] = useState<number>(0);
  
  const [paliText, setPaliText] = useState('');
  const [kannadaText, setKannadaText] = useState('');
  const [paliSaved, setPaliSaved] = useState(false);
  const [kannadaSaved, setKannadaSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track original values to detect changes
  const [originalPaliText, setOriginalPaliText] = useState('');
  const [originalKannadaText, setOriginalKannadaText] = useState('');

  // Initialize indices when modal opens or editingRow changes
  useEffect(() => {
    if (editingRow && allRows.length > 0) {
      const initialIndex = allRows.findIndex(row => row.id === editingRow.id);
      if (initialIndex !== -1) {
        setCurrentPaliIndex(initialIndex);
        setCurrentKannadaIndex(initialIndex);
        setPaliText(allRows[initialIndex].paliText);
        setKannadaText(allRows[initialIndex].kannadaText);
        setOriginalPaliText(allRows[initialIndex].paliText);
        setOriginalKannadaText(allRows[initialIndex].kannadaText);
        setPaliSaved(false);
        setKannadaSaved(false);
      }
    }
  }, [editingRow, allRows]);

  // Update texts when indices change
  useEffect(() => {
    if (allRows[currentPaliIndex]) {
      setPaliText(allRows[currentPaliIndex].paliText);
      setOriginalPaliText(allRows[currentPaliIndex].paliText);
      setPaliSaved(false);
    }
  }, [currentPaliIndex, allRows]);

  useEffect(() => {
    if (allRows[currentKannadaIndex]) {
      setKannadaText(allRows[currentKannadaIndex].kannadaText);
      setOriginalKannadaText(allRows[currentKannadaIndex].kannadaText);
      setKannadaSaved(false);
    }
  }, [currentKannadaIndex, allRows]);

  // Check if both columns have been edited
  const paliWasEdited = paliText !== originalPaliText;
  const kannadaWasEdited = kannadaText !== originalKannadaText;
  const bothEdited = paliWasEdited && kannadaWasEdited;
  
  // Check if either will split into multiple lines
  const paliWillSplit = paliText.split('\n').length > 1;
  const kannadaWillSplit = kannadaText.split('\n').length > 1;
  
  // Show warning if both edited AND at least one will split
  const showWarning = bothEdited && (paliWillSplit || kannadaWillSplit);

  const handleSavePali = useCallback(() => {
    const currentPaliRow = allRows[currentPaliIndex];
    const currentKannadaRow = allRows[currentKannadaIndex];
    
    if (!currentPaliRow || !currentKannadaRow) return;
  
    // Pass all 4 parameters including the Kannada row's ID
    onSavePali(
      currentPaliRow.id,      // Which row to save Pali to
      paliText,                // The Pali text
      kannadaText,             // The Kannada text (for checking if edited)
      currentKannadaRow.id     // Which row the Kannada is from
    );
    
    setPaliSaved(true);
    if (kannadaWasEdited && paliWillSplit) {
      setKannadaSaved(true);
      setTimeout(() => {
        setPaliSaved(false);
        setKannadaSaved(false);
      }, 2000);
    } else {
      setTimeout(() => setPaliSaved(false), 2000);
    }
    
    // Update originals after save
    setOriginalPaliText(paliText);
    if (kannadaWasEdited && paliWillSplit) {
      setOriginalKannadaText(kannadaText);
    }
  }, [
    allRows, 
    currentPaliIndex, 
    currentKannadaIndex, 
    paliText, 
    kannadaText, 
    kannadaWasEdited, 
    paliWillSplit, 
    onSavePali
  ]);

  const handleSaveKannada = useCallback(() => {
    const currentKannadaRow = allRows[currentKannadaIndex];
    const currentPaliRow = allRows[currentPaliIndex];
    
    if (!currentKannadaRow || !currentPaliRow) return;
  
    // Pass all 4 parameters including the Pali row's ID
    onSaveKannada(
      currentKannadaRow.id,    // Which row to save Kannada to
      kannadaText,             // The Kannada text
      paliText,                // The Pali text (for checking if edited)
      currentPaliRow.id        // Which row the Pali is from
    );
    
    setKannadaSaved(true);
    if (paliWasEdited && kannadaWillSplit) {
      setPaliSaved(true);
      setTimeout(() => {
        setKannadaSaved(false);
        setPaliSaved(false);
      }, 2000);
    } else {
      setTimeout(() => setKannadaSaved(false), 2000);
    }
    
    // Update originals after save
    setOriginalKannadaText(kannadaText);
    if (paliWasEdited && kannadaWillSplit) {
      setOriginalPaliText(paliText);
    }
  }, [
    allRows, 
    currentKannadaIndex, 
    currentPaliIndex, 
    kannadaText, 
    paliText, 
    paliWasEdited, 
    kannadaWillSplit, 
    onSaveKannada
  ]);

  // ✅ FIXED: Navigate to ALL rows including empty ones
  const handleNavigatePali = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentPaliIndex > 0) {
        setCurrentPaliIndex(currentPaliIndex - 1);
      }
    } else {
      if (currentPaliIndex < allRows.length - 1) {
        setCurrentPaliIndex(currentPaliIndex + 1);
      }
    }
  }, [currentPaliIndex, allRows.length]);

  const handleNavigateKannada = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentKannadaIndex > 0) {
        setCurrentKannadaIndex(currentKannadaIndex - 1);
      }
    } else {
      if (currentKannadaIndex < allRows.length - 1) {
        setCurrentKannadaIndex(currentKannadaIndex + 1);
      }
    }
  }, [currentKannadaIndex, allRows.length]);

  const handleNavigateBoth = useCallback((direction: 'prev' | 'next') => {
    handleNavigatePali(direction);
    handleNavigateKannada(direction);
  }, [handleNavigatePali, handleNavigateKannada]);

  // Add merge handlers after the navigation handlers
    // ✅ ADD these two simple handlers (inside the component)
    const handleMergePali = useCallback((direction: 'prev' | 'next') => {
      onMergePali(currentPaliIndex, direction);
    }, [currentPaliIndex, onMergePali]);
  
    const handleMergeKannada = useCallback((direction: 'prev' | 'next') => {
      onMergeKannada(currentKannadaIndex, direction);
    }, [currentKannadaIndex, onMergeKannada]);



  // Helper functions for button states
  const canNavigatePaliPrev = currentPaliIndex > 0;
  const canNavigatePaliNext = currentPaliIndex < allRows.length - 1;
  const canNavigateKannadaPrev = currentKannadaIndex > 0;
  const canNavigateKannadaNext = currentKannadaIndex < allRows.length - 1;

  // Keyboard shortcuts
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        handleNavigatePali('prev');
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        e.preventDefault();
        handleNavigatePali('next');
      }
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        handleNavigateKannada('prev');
      }
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        handleNavigateKannada('next');
      }
      if (e.altKey && e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        handleNavigateBoth('prev');
      }
      if (e.altKey && e.ctrlKey && e.key === 'ArrowDown') {
        e.preventDefault();
        handleNavigateBoth('next');
      }
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleNavigatePali, handleNavigateKannada, handleNavigateBoth]);

  if (!editingRow || allRows.length === 0) return null;

  const currentPaliRow = allRows[currentPaliIndex];
  const currentKannadaRow = allRows[currentKannadaIndex];

  const modalWidth = isFullscreen ? '98vw' : '90vw';
  const maxModalWidth = isFullscreen ? 'none' : '1400px';

  return (
  <Modal
    title={
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '40px' }}>
        <Space>
          <EditOutlined style={{ color: '#00b3a4' }} />
          <span>Edit Content (Total: {allRows.length} rows)</span>
        </Space>
        <Button
          type="text"
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{ color: '#00b3a4' }}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>
    }
    open={visible}
    onCancel={onClose}
    width={modalWidth}
    centered={!isFullscreen}
    style={{ 
      maxWidth: maxModalWidth,
      top: isFullscreen ? 10 : 20,
      paddingBottom: isFullscreen ? 10 : 20,
    }}
    styles={{
      body: {
        maxHeight: isFullscreen ? 'calc(100vh - 140px)' : 'calc(90vh - 160px)',
        minHeight: isFullscreen ? 'calc(100vh - 140px)' : '60vh',
        overflowY: 'auto',
        padding: '16px',
      }
    }}
    footer={null}
  >
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Warning Banner */}
      {showWarning && (
        <Alert
          message={
            currentPaliIndex === currentKannadaIndex
              ? "Both Columns Edited (Same Row #" + (currentPaliIndex + 1) + ")"
              : "Both Columns Edited (Different Rows)"
          }
          description={
            currentPaliIndex === currentKannadaIndex ? (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text>
                  You&apos;ve edited both Pali and Kannada on the same row, and at least one will split into multiple lines.
                </Text>
                <Text strong style={{ color: '#faad14' }}>
                  🔄 When you click save, the other column&apos;s text will attach to the first non-empty split line.
                </Text>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>
                    <Text type="secondary">
                      Example: Pali &quot;A\nB\nC&quot; → Kannada will attach to line &quot;A&quot;
                    </Text>
                  </li>
                </ul>
              </Space>
            ) : (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text>
                  You&apos;ve edited Pali and Kannada on <strong>different rows</strong>:
                </Text>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  <li>Pali: <strong>Row #{currentPaliIndex + 1}</strong></li>
                  <li>Kannada: <strong>Row #{currentKannadaIndex + 1}</strong></li>
                </ul>
                <Text strong style={{ color: '#faad14' }}>
                  🔄 Clicking save will update BOTH rows independently at their respective positions.
                </Text>
              </Space>
            )
          }
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          closable
          style={{
            border: '2px solid #faad14',
            backgroundColor: 'rgba(250, 173, 20, 0.1)',
          }}
        />
      )}

      {/* ✅ SIDE-BY-SIDE LAYOUT */}
      <Row gutter={16}>
        {/* Pali Column - Left Side */}
        <Col xs={24} lg={12}>
          <div style={{
            padding: '16px',
            background: '#0d1b2a',
            borderRadius: '8px',
            border: '2px solid #1890ff',
            height: '100%'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px' 
            }}>
              <Space>
                <Title level={5} style={{ marginBottom: 0, color: '#1890ff' }}>
                  Pali Text
                </Title>
                <Tag color="blue">Row #{currentPaliIndex + 1}</Tag>
                {paliWasEdited && <Tag color="orange">Edited</Tag>}
              </Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSavePali}
                size="small"
                style={{ 
                  backgroundColor: paliSaved ? '#52c41a' : '#1890ff',
                  borderColor: paliSaved ? '#52c41a' : '#1890ff',
                }}
              >
                {paliSaved ? 'Saved!' : (
                  kannadaWasEdited && paliWillSplit
                    ? '💾 Save Both'
                    : 'Save'
                )}
              </Button>
            </div>

            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '8px' }}>
              Use line breaks to split into multiple rows
            </Text>

            <TextArea
              value={paliText}
              onChange={(e) => {
                setPaliText(e.target.value);
                setPaliSaved(false);
              }}
              rows={isFullscreen ? 12 : 8}
              placeholder="Enter Pali text (use newlines to split into multiple rows)"
              style={{ 
                fontSize: '14px',
                fontFamily: 'monospace',
                borderColor: paliWasEdited ? '#faad14' : '#1890ff',
                borderWidth: '2px',
                marginBottom: '12px'
              }}
            />

            {/* Pali Merge Buttons */}
            <div style={{ 
              marginBottom: '12px',
              display: 'flex',
              gap: '8px',
              justifyContent: 'space-between'
            }}>
              <Button
                size="small"
                onClick={() => handleMergePali('prev')}
                disabled={currentPaliIndex === 0}
                style={{ borderColor: '#1890ff', color: '#1890ff', flex: 1 }}
              >
                ⬆️ Merge Prev
              </Button>
              <Button
                size="small"
                onClick={() => handleMergePali('next')}
                disabled={currentPaliIndex >= allRows.length - 1}
                style={{ borderColor: '#1890ff', color: '#1890ff', flex: 1 }}
              >
                Merge Next ⬇️
              </Button>
            </div>
            
            {/* Pali Navigation */}
            <div style={{ 
              padding: '8px',
              background: '#1f1f1f',
              borderRadius: '4px',
              borderLeft: '3px solid #1890ff',
              marginBottom: '8px'
            }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  icon={<LeftOutlined />}
                  onClick={() => handleNavigatePali('prev')}
                  disabled={!canNavigatePaliPrev}
                  size="small"
                  style={{ 
                    borderColor: '#1890ff', 
                    color: canNavigatePaliPrev ? '#1890ff' : '#666' 
                  }}
                >
                  Prev
                </Button>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  Ctrl+Shift+↑/↓
                </Text>
                <Button
                  icon={<RightOutlined />}
                  onClick={() => handleNavigatePali('next')}
                  disabled={!canNavigatePaliNext}
                  size="small"
                  style={{ 
                    borderColor: '#1890ff', 
                    color: canNavigatePaliNext ? '#1890ff' : '#666' 
                  }}
                >
                  Next
                </Button>
              </Space>
            </div>

            {/* Pali Metadata */}
            {currentPaliRow?.paliTags && currentPaliRow.paliTags.length > 0 && (
              <div style={{ 
                padding: '6px 8px',
                background: '#1a1a2e',
                borderRadius: '4px',
                marginBottom: '4px'
              }}>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  Tags: {currentPaliRow.paliTags.join(', ')}
                </Text>
              </div>
            )}
            {(currentPaliRow?.paliType || currentPaliRow?.paliTypename) && (
              <div style={{ 
                padding: '6px 8px',
                background: '#1a1a2e',
                borderRadius: '4px',
              }}>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  {currentPaliRow.paliType && `Type: ${currentPaliRow.paliType}`}
                  {currentPaliRow.paliType && currentPaliRow.paliTypename && ' | '}
                  {currentPaliRow.paliTypename && `Typename: ${currentPaliRow.paliTypename}`}
                </Text>
              </div>
            )}
          </div>
        </Col>

        {/* Kannada Column - Right Side */}
        <Col xs={24} lg={12}>
          <div style={{
            padding: '16px',
            background: '#0a1f0a',
            borderRadius: '8px',
            border: '2px solid #52c41a',
            height: '100%'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px' 
            }}>
              <Space>
                <Title level={5} style={{ marginBottom: 0, color: '#52c41a' }}>
                  Kannada Text
                </Title>
                <Tag color="green">Row #{currentKannadaIndex + 1}</Tag>
                {kannadaWasEdited && <Tag color="orange">Edited</Tag>}
              </Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveKannada}
                size="small"
                style={{ 
                  backgroundColor: kannadaSaved ? '#1890ff' : '#52c41a',
                  borderColor: kannadaSaved ? '#1890ff' : '#52c41a',
                }}
              >
                {kannadaSaved ? 'Saved!' : (
                  paliWasEdited && kannadaWillSplit
                    ? '💾 Save Both'
                    : 'Save'
                )}
              </Button>
            </div>

            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '8px' }}>
              Use line breaks to split into multiple rows
            </Text>

            <TextArea
              value={kannadaText}
              onChange={(e) => {
                setKannadaText(e.target.value);
                setKannadaSaved(false);
              }}
              rows={isFullscreen ? 12 : 8}
              placeholder="Enter Kannada text (use newlines to split into multiple rows)"
              style={{ 
                fontSize: '14px',
                fontFamily: 'monospace',
                borderColor: kannadaWasEdited ? '#faad14' : '#52c41a',
                borderWidth: '2px',
                marginBottom: '12px'
              }}
            />
            
            {/* Kannada Merge Buttons */}
            <div style={{ 
              marginBottom: '12px',
              display: 'flex',
              gap: '8px',
              justifyContent: 'space-between'
            }}>
              <Button
                size="small"
                onClick={() => handleMergeKannada('prev')}
                disabled={currentKannadaIndex === 0}
                style={{ borderColor: '#52c41a', color: '#52c41a', flex: 1 }}
              >
                ⬆️ Merge Prev
              </Button>
              <Button
                size="small"
                onClick={() => handleMergeKannada('next')}
                disabled={currentKannadaIndex >= allRows.length - 1}
                style={{ borderColor: '#52c41a', color: '#52c41a', flex: 1 }}
              >
                Merge Next ⬇️
              </Button>
            </div>

            {/* Kannada Navigation */}
            <div style={{ 
              padding: '8px',
              background: '#1f1f1f',
              borderRadius: '4px',
              borderLeft: '3px solid #52c41a',
              marginBottom: '8px'
            }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  icon={<LeftOutlined />}
                  onClick={() => handleNavigateKannada('prev')}
                  disabled={!canNavigateKannadaPrev}
                  size="small"
                  style={{ 
                    borderColor: '#52c41a', 
                    color: canNavigateKannadaPrev ? '#52c41a' : '#666' 
                  }}
                >
                  Prev
                </Button>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  Alt+↑/↓
                </Text>
                <Button
                  icon={<RightOutlined />}
                  onClick={() => handleNavigateKannada('next')}
                  disabled={!canNavigateKannadaNext}
                  size="small"
                  style={{ 
                    borderColor: '#52c41a', 
                    color: canNavigateKannadaNext ? '#52c41a' : '#666' 
                  }}
                >
                  Next
                </Button>
              </Space>
            </div>

            {/* Kannada Metadata */}
            {currentKannadaRow?.kannadaTags && currentKannadaRow.kannadaTags.length > 0 && (
              <div style={{ 
                padding: '6px 8px',
                background: '#1a2e1a',
                borderRadius: '4px',
                marginBottom: '4px'
              }}>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  Tags: {currentKannadaRow.kannadaTags.join(', ')}
                </Text>
              </div>
            )}
            {(currentKannadaRow?.kannadaType || currentKannadaRow?.kannadaTypename) && (
              <div style={{ 
                padding: '6px 8px',
                background: '#1a2e1a',
                borderRadius: '4px',
              }}>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  {currentKannadaRow.kannadaType && `Type: ${currentKannadaRow.kannadaType}`}
                  {currentKannadaRow.kannadaType && currentKannadaRow.kannadaTypename && ' | '}
                  {currentKannadaRow.kannadaTypename && `Typename: ${currentKannadaRow.kannadaTypename}`}
                </Text>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Both Navigation - Centered Below */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px',
        background: '#1f1f1f',
        borderRadius: '6px',
      }}>
        <Space>
          <Button
            icon={<LeftOutlined />}
            onClick={() => handleNavigateBoth('prev')}
            disabled={(!canNavigateKannadaPrev || !canNavigatePaliPrev) || (currentKannadaIndex !== currentPaliIndex)}
            size="middle"
            style={{ 
              borderColor: '#52c41a', 
              color: (canNavigateKannadaPrev && canNavigatePaliPrev) ? '#52c41a' : '#666' 
            }}
          >
            Previous Both
          </Button>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Alt + Ctrl + ↑/↓
          </Text>
          <Button
            icon={<RightOutlined />}
            onClick={() => handleNavigateBoth('next')}
            disabled={(!canNavigateKannadaNext || !canNavigatePaliNext) || (currentKannadaIndex !== currentPaliIndex)}
            size="middle"
            style={{ 
              borderColor: '#52c41a', 
              color: (canNavigateKannadaNext && canNavigatePaliNext) ? '#52c41a' : '#666' 
            }}
          >
            Next Both
          </Button>
        </Space>
      </div>

      {/* Help Text */}
      <div style={{ 
        padding: '12px', 
        background: '#1f1f1f', 
        borderRadius: '6px',
        borderLeft: '3px solid #faad14'
      }}>
        <Space direction="vertical" size="small">
          <Text type="secondary">
            <strong>💡 Tips & Keyboard Shortcuts:</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            • <strong>Pali Navigation:</strong> Ctrl+Shift+↑/↓ to move between Pali entries
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            • <strong>Kannada Navigation:</strong> Alt+↑/↓ to move between Kannada entries
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            • <strong>Both Navigation:</strong> Alt+Ctrl+↑/↓ to move both together
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            • <strong>Fullscreen:</strong> Press F11 to toggle fullscreen mode
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            • <strong>Main View Shortcuts:</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', paddingLeft: '16px' }}>
            ◦ Click checkbox: Select single column
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', paddingLeft: '16px' }}>
            ◦ Shift+Click checkbox: Select both columns
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', paddingLeft: '16px' }}>
            ◦ Double-click text: Open edit modal
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', paddingLeft: '16px' }}>
            ◦ Click tag/type: Quick edit metadata
          </Text>
        </Space>
      </div>
    </Space>
  </Modal>
);
};