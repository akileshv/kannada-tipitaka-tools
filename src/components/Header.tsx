import React from 'react';
import Image from 'next/image';

export const Header: React.FC = () => {
  return (
    <div style={{
      marginBottom: '10px',
      padding: '0px 10px',
      background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
      borderRadius: '8px',
      border: '1px solid #303030'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#e0e3e7'
      }}>
        <Image
          src="/logo.svg"
          alt="Bilingual Text Alignment Tool"
          width={75}
          height={75}
          style={{ objectFit: 'contain', paddingRight: '10px' }}
          priority
        />
        Bilingual Text Alignment Tool
      </div>
    </div>
  );
};