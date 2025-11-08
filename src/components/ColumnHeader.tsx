import React from 'react';
import { Row, Col, Checkbox, Typography, Tag, Space } from 'antd';

const { Title, Text } = Typography;

interface ColumnHeaderProps {
  selectedPaliCount: number;
  selectedKannadaCount: number;
  totalRows: number;
  onSelectAllPali: () => void;
  onSelectAllKannada: () => void;
  fontSize?: number;
  isFullViewMode?: boolean;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  selectedPaliCount,
  selectedKannadaCount,
  totalRows,
  onSelectAllPali,
  onSelectAllKannada,
  isFullViewMode = false,
  fontSize = 100, // ✅ ADD THIS
}) => {
  const fontScale = fontSize / 100; // ✅ ADD THIS

  return (
    <Row 
      gutter={16} 
      style={{ 
        marginBottom: isFullViewMode ? '8px' : '16px',
        padding: isFullViewMode ? `${8 * fontScale}px` : `${12 * fontScale}px`,
        background: '#262626',
        borderRadius: '6px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0
      }}
    >
      <Col xs={24} md={11}>
        <Space>
          <Checkbox
            checked={selectedPaliCount === totalRows && totalRows > 0}
            indeterminate={selectedPaliCount > 0 && selectedPaliCount < totalRows}
            onChange={onSelectAllPali}
            style={{ 
              transform: `scale(${fontScale})`,
              transformOrigin: 'center'
            }}
          />
          <Title level={5} style={{ 
            margin: 0, 
            color: '#1890ff', 
            fontSize: isFullViewMode ? `${14 * fontScale}px` : `${16 * fontScale}px` 
          }}>
            Pali Text
          </Title>
          {selectedPaliCount > 0 && (
            <Tag color="blue" style={{ fontSize: `${12 * fontScale}px` }}>
              {selectedPaliCount} selected
            </Tag>
          )}
        </Space>
      </Col>
      <Col xs={24} md={2} style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ 
          fontSize: isFullViewMode ? `${11 * fontScale}px` : `${13 * fontScale}px` 
        }}>
          Actions
        </Text>
      </Col>
      <Col xs={24} md={11}>
        <Space>
          <Checkbox
            checked={selectedKannadaCount === totalRows && totalRows > 0}
            indeterminate={selectedKannadaCount > 0 && selectedKannadaCount < totalRows}
            onChange={onSelectAllKannada}
            style={{ 
              transform: `scale(${fontScale})`,
              transformOrigin: 'center'
            }}
          />
          <Title level={5} style={{ 
            margin: 0, 
            color: '#52c41a', 
            fontSize: isFullViewMode ? `${14 * fontScale}px` : `${16 * fontScale}px` 
          }}>
            Kannada Text
          </Title>
          {selectedKannadaCount > 0 && (
            <Tag color="green" style={{ fontSize: `${12 * fontScale}px` }}>
              {selectedKannadaCount} selected
            </Tag>
          )}
        </Space>
      </Col>
    </Row>
  );
};