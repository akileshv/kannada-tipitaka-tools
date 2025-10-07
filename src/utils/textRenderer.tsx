import React from 'react';
import { Typography } from 'antd';
import { TYPE_STYLES, ELEMENT_MAP } from '../constants';

const { Text } = Typography;

export const renderTextWithType = (text: string, type?: string, typename?: string): React.ReactNode => {
  if (!text || !text.trim()) {
    return <Text type="secondary" italic>(empty)</Text>;
  }

  const displayType = type || typename || 'p';
  const style = TYPE_STYLES[displayType.toLowerCase()] || TYPE_STYLES.p;
  const ElementTag = ELEMENT_MAP[displayType.toLowerCase()] || 'div';

  return React.createElement(ElementTag, { style }, text);
};