import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import type { ContentRow } from '../types';

const { Title, Text } = Typography;

interface FooterProps {
  contentRows: ContentRow[];
  historyCount: number;
}

export const Footer: React.FC<FooterProps> = ({ contentRows, historyCount }) => {
  if (contentRows.length === 0) return null;

  const taggedCount = contentRows.filter(row => 
    (row.paliTags && row.paliTags.length > 0) || 
    (row.kannadaTags && row.kannadaTags.length > 0)
  ).length;

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
              {contentRows.length}
            </Title>
            <Text type="secondary">Total Rows</Text>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              {historyCount}
            </Title>
            <Text type="secondary">History States</Text>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <Title level={4} style={{ margin: 0, color: '#faad14' }}>
              {taggedCount}
            </Title>
            <Text type="secondary">Tagged Rows</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};