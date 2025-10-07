import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '../styles.css';

export const metadata: Metadata = {
  title: 'Bilingual Text Alignment Tool',
  description: 'Tool for aligning Pali and Kannada texts',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}