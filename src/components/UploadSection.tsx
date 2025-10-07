import React from 'react';
import { Row, Col, Collapse, Space, Tag, Typography, Upload } from 'antd';
import { UploadOutlined, FileTextOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Dragger } = Upload;

interface UploadSectionProps {
  showUploadSection: boolean;
  setShowUploadSection: (show: boolean) => void;
  onFileUpload: (file: File, column: 'pali' | 'kannada') => boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  showUploadSection,
  setShowUploadSection,
  onFileUpload,
}) => {
  return (
    <Collapse
      activeKey={showUploadSection ? ['upload'] : []}
      onChange={(keys) => setShowUploadSection(keys.includes('upload'))}
      style={{ 
        marginBottom: '18px',
        background: '#1a1c21',
        borderColor: '#2a2d34',
      }}
      expandIcon={() => null}
      items={[
        {
          key: 'upload',
          label: (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <Space>
                <UploadOutlined style={{ fontSize: '18px', color: '#00b3a4' }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#e0e3e7' }}>
                  Upload Files
                </span>
                {!showUploadSection && <Tag color="blue">Click to expand</Tag>}
              </Space>
              <div style={{ marginLeft: 'auto', paddingLeft: '16px' }}>
                {showUploadSection ? 
                  <DownOutlined style={{ fontSize: '16px', color: '#00b3a4', transition: 'all 0.3s ease' }} /> : 
                  <UpOutlined style={{ fontSize: '16px', color: '#a0a3aa', transition: 'all 0.3s ease' }} />
                }
              </div>
            </div>
          ),
          children: (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <UploadBox
                  title="Upload Pali Text"
                  color="#00b3a4"
                  onUpload={(file) => onFileUpload(file, 'pali')}
                />
              </Col>
              <Col xs={24} md={12}>
                <UploadBox
                  title="Upload Kannada Text"
                  color="#30c48d"
                  onUpload={(file) => onFileUpload(file, 'kannada')}
                />
              </Col>
            </Row>
          ),
          style: {
            background: 'linear-gradient(135deg, #16181c 0%, #1a1c21 100%)',
            borderColor: '#2a2d34',
            marginBottom: 0,
          },
        },
      ]}
      bordered={true}
    />
  );
};

interface UploadBoxProps {
  title: string;
  color: string;
  onUpload: (file: File) => boolean;
}

const UploadBox: React.FC<UploadBoxProps> = ({ title, color, onUpload }) => {
  return (
    <div 
      style={{ 
        padding: '16px', 
        background: '#1a1c21', 
        borderRadius: '6px',
        border: `2px dashed ${color}`,
        transition: 'all 0.25s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 12px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Title level={5} style={{ color, marginBottom: '12px' }}>
        {title}
      </Title>
      <Dragger
        accept=".txt,.json"
        beforeUpload={onUpload}
        showUploadList={false}
        style={{ background: '#16181c', borderColor: color }}
      >
        <p className="ant-upload-drag-icon">
          <FileTextOutlined style={{ fontSize: '48px', color }} />
        </p>
        <p className="ant-upload-text" style={{ color: '#e0e3e7' }}>
          Click or drag file here
        </p>
        <p className="ant-upload-hint" style={{ color: '#a0a3aa' }}>
          Support for .txt and .json files
        </p>
        <p className="ant-upload-hint" style={{ color: '#faad14', fontSize: '12px', marginTop: '8px' }}>
          💡 Upload exported JSON to restore with all metadata
        </p>
      </Dragger>
    </div>
  );
};