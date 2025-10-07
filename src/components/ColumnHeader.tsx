import React from 'react';
import { Row, Col, Space, Checkbox, Typography, Tag } from 'antd';

const { Title } = Typography;

interface ColumnHeaderProps {
  paliSelectedCount: number;
  kannadaSelectedCount: number;
  onSelectAllPali: () => void;
  onSelectAllKannada: () => void;
  allPaliSelected: boolean;
  allKannadaSelected: boolean;
  somePaliSelected: boolean;
  someKannadaSelected: boolean;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  paliSelectedCount,
  kannadaSelectedCount,
  onSelectAllPali,
  onSelectAllKannada,
  allPaliSelected,
  allKannadaSelected,
  somePaliSelected,
  someKannadaSelected,
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
      <Col xs={24} md={12}>
        <Space>
          <Checkbox
            checked={allPaliSelected}
            indeterminate={somePaliSelected}
            onChange={onSelectAllPali}
          />
          <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
            Pali Text
          </Title>
          {paliSelectedCount > 0 && (
            <Tag color="blue">{paliSelectedCount} selected</Tag>
          )}
        </Space>
      </Col>
      <Col xs={24} md={12}>
        <Space>
          <Checkbox
            checked={allKannadaSelected}
            indeterminate={someKannadaSelected}
            onChange={onSelectAllKannada}
          />
          <Title level={5} style={{ margin: 0, color: '#52c41a' }}>
            Kannada Text
          </Title>
          {kannadaSelectedCount > 0 && (
            <Tag color="green">{kannadaSelectedCount} selected</Tag>
          )}
        </Space>
      </Col>
    </Row>
  );
};