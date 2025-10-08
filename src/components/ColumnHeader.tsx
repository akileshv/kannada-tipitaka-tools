import React from 'react';
import { Row, Col, Checkbox, Typography, Tag, Space } from 'antd';

const { Title, Text } = Typography;

interface ColumnHeaderProps {
  selectedPaliCount: number;
  selectedKannadaCount: number;
  totalRows: number;
  onSelectAllPali: () => void;
  onSelectAllKannada: () => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  selectedPaliCount,
  selectedKannadaCount,
  totalRows,
  onSelectAllPali,
  onSelectAllKannada,
}) => {
  return (
    <Row 
      gutter={16} 
      style={{ 
        marginBottom: '16px',
        padding: '12px',
        background: '#262626',
        borderRadius: '6px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <Col xs={24} md={11}>
        <Space>
          <Checkbox
            checked={selectedPaliCount === totalRows && totalRows > 0}
            indeterminate={selectedPaliCount > 0 && selectedPaliCount < totalRows}
            onChange={onSelectAllPali}
          />
          <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
            Pali Text
          </Title>
          {selectedPaliCount > 0 && (
            <Tag color="blue">{selectedPaliCount} selected</Tag>
          )}
        </Space>
      </Col>
      <Col xs={24} md={2} style={{ textAlign: 'center' }}>
        <Text type="secondary">Actions</Text>
      </Col>
      <Col xs={24} md={11}>
        <Space>
          <Checkbox
            checked={selectedKannadaCount === totalRows && totalRows > 0}
            indeterminate={selectedKannadaCount > 0 && selectedKannadaCount < totalRows}
            onChange={onSelectAllKannada}
          />
          <Title level={5} style={{ margin: 0, color: '#52c41a' }}>
            Kannada Text
          </Title>
          {selectedKannadaCount > 0 && (
            <Tag color="green">{selectedKannadaCount} selected</Tag>
          )}
        </Space>
      </Col>
    </Row>
  );
};