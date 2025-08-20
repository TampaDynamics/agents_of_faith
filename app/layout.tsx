import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agents of Faith - Theological AI Assistant',
  description: 'Get comprehensive answers to theological questions grounded in Scripture and Christian tradition.',
  keywords: ['theology', 'bible', 'christian', 'AI', 'faith', 'scripture', 'doctrine'],
  authors: [{ name: 'Agents of Faith' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Agents of Faith',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
