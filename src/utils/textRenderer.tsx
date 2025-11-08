import React, { JSX } from 'react';
import { Typography } from 'antd';
import { TYPE_STYLES, ELEMENT_MAP } from '../constants';

const { Text } = Typography;

export const renderTextWithType = (
  text: string, 
  type?: string, 
  typename?: string,
  fontScale: number = 1 // ✅ ADD THIS
): React.ReactNode => {
  // Show placeholder for truly empty or whitespace-only text
  if (!text || text.trim() === '') {
    return (
      <Text 
        type="secondary" 
        italic 
        style={{ fontSize: `${12 * fontScale}px` }}
      >
        (empty)
      </Text>
    );
  }

  const displayType = type || typename || 'p';
  const baseStyle = TYPE_STYLES[displayType.toLowerCase()] || TYPE_STYLES.p;
  
  // ✅ Scale the font size
  const scaledStyle = {
    ...baseStyle,
    fontSize: typeof baseStyle.fontSize === 'string' 
      ? `${parseFloat(baseStyle.fontSize) * fontScale}px`
      : baseStyle.fontSize,
  };
  
  const ElementTag = ELEMENT_MAP[displayType.toLowerCase()] || 'div';

  return React.createElement(
    ElementTag as keyof JSX.IntrinsicElements, 
    { style: scaledStyle }, 
    text
  );
};