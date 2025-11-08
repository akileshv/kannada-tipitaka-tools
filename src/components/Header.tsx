import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Tooltip, Slider, Popover, Space, Typography } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, FontSizeOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface HeaderProps {
  isFullViewMode?: boolean;
  onToggleFullView?: () => void;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isFullViewMode = false, 
  onToggleFullView,
  fontSize = 100,
  onFontSizeChange
}) => {
  const [fontSizePopoverOpen, setFontSizePopoverOpen] = useState(false);

  const fontSizeContent = (
    <div style={{ width: '250px', padding: '8px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong style={{ color: '#e0e3e7' }}>Font Size: {fontSize}%</Text>
          <Slider
            min={70}
            max={150}
            step={10}
            value={fontSize}
            onChange={(value) => onFontSizeChange?.(value)}
            marks={{
              70: '70%',
              100: { style: { color: '#00b3a4' }, label: '100%' },
              150: '150%'
            }}
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
        
        <Space wrap size="small">
          <Button size="small" onClick={() => onFontSizeChange?.(80)}>Small</Button>
          <Button size="small" onClick={() => onFontSizeChange?.(100)} type="primary">Default</Button>
          <Button size="small" onClick={() => onFontSizeChange?.(120)}>Large</Button>
          <Button size="small" onClick={() => onFontSizeChange?.(140)}>X-Large</Button>
        </Space>

        <Text type="secondary" style={{ fontSize: '11px' }}>
          Adjust the text size for better readability
        </Text>
      </Space>
    </div>
  );

  return (
    <div style={{
      marginBottom: isFullViewMode ? '6px' : '10px',
      padding: isFullViewMode ? '2px 10px' : '0px 10px',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
      borderRadius: '8px',
      border: '1px solid #303030',
      transition: 'all 0.3s ease',
      flexShrink: 0
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: isFullViewMode ? '32px' : '75px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: isFullViewMode ? '14px' : '20px',
          fontWeight: 'bold',
          color: '#e0e3e7',
          transition: 'font-size 0.3s ease'
        }}>
          {!isFullViewMode && (
            <Image
              src="/logo.svg"
              alt="Bilingual Text Alignment Tool"
              width={75}
              height={75}
              style={{ objectFit: 'contain', paddingRight: '10px' }}
              priority
            />
          )}
          <span>{isFullViewMode ? 'Focus Mode' : 'Bilingual Text Alignment Tool'}</span>
        </div>
        
        <Space size="small">
          {/* Font Size Control */}
          {onFontSizeChange && (
            <Popover
              content={fontSizeContent}
              title="Adjust Font Size"
              trigger="click"
              open={fontSizePopoverOpen}
              onOpenChange={setFontSizePopoverOpen}
              placement="bottomRight"
            >
              <Tooltip title="Adjust font size">
                <Button
                  type="text"
                  size={isFullViewMode ? "small" : "middle"}
                  icon={<FontSizeOutlined />}
                  style={{ 
                    color: fontSize !== 100 ? '#faad14' : '#00b3a4',
                    fontSize: isFullViewMode ? '14px' : '16px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {!isFullViewMode && `${fontSize}%`}
                </Button>
              </Tooltip>
            </Popover>
          )}

          {/* Full View Toggle */}
          {onToggleFullView && (
            <Tooltip title={isFullViewMode ? "Exit Focus Mode (F9)" : "Focus Mode - Hide Upload & Actions (F9)"}>
              <Button
                type="text"
                size={isFullViewMode ? "small" : "middle"}
                icon={isFullViewMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={onToggleFullView}
                style={{ 
                  color: '#00b3a4',
                  fontSize: isFullViewMode ? '14px' : '16px',
                  transition: 'all 0.3s ease'
                }}
              >
                {isFullViewMode ? 'Exit' : 'Focus Mode'}
              </Button>
            </Tooltip>
          )}
        </Space>
      </div>
    </div>
  );
};