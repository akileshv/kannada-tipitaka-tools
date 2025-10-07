import React from 'react';
import { Card, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;

interface FooterProps {
  totalRows: number;
  historyLength: number;
  taggedRowsCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  totalRows,
  historyLength,
  taggedRowsCount,
}) => {
  if (totalRows === 0) return null;

  return (
    <Card 
      style={{ 
        marginTop: '24px',
        background: '#1a1a1a',
        borderColor: '#303030'
      }}
      styles={{ body: { padding: '16px' } }}
    >
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              {totalRows}
            </Title>
            <Text type="secondary">Total Rows</Text>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              {historyLength}
            </Title>
            <Text type="secondary">History States</Text>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <Title level={4} style={{ margin: 0, color: '#faad14' }}>
              {taggedRowsCount}
            </Title>
            <Text type="secondary">Tagged Rows</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};