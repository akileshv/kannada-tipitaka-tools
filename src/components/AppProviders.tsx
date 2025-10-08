import React from 'react';
import { ConfigProvider, theme, App as AntApp } from 'antd';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgBase: '#0e0f13',
          colorBgContainer: '#1a1c21',
          colorBorder: '#2a2d34',
          colorText: '#e0e3e7',
          colorTextSecondary: '#a0a3aa',
          colorPrimary: '#00b3a4',
          colorSuccess: '#30c48d',
          colorError: '#ff5c5c',
          colorWarning: '#f1a43c',
          colorInfo: '#37a2f2',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
        },
        components: {
          Card: {
            colorBgContainer: '#1a1c21',
            colorBorder: '#2a2d34',
          },
          Button: {
            colorPrimary: '#00b3a4',
            colorPrimaryHover: '#00c9b8',
            algorithm: true,
          },
          Input: {
            colorBgContainer: '#16181c',
            colorBorder: '#2a2d34',
          },
          Select: {
            colorBgContainer: '#16181c',
            colorBorder: '#2a2d34',
          },
          Modal: {
            colorBgElevated: '#1a1c21',
            headerBg: '#16181c',
          },
          Upload: {
            colorBgContainer: '#16181c',
            colorBorder: '#2a2d34',
          },
        },
      }}
    >
      <AntApp>
        {children}
      </AntApp>
    </ConfigProvider>
  );
};