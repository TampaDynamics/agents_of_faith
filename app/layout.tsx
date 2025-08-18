import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agents of Faith - Theological AI Assistant',
  description: 'Get comprehensive answers to theological questions grounded in Scripture and Christian tradition.',
  keywords: ['theology', 'bible', 'christian', 'AI', 'faith', 'scripture', 'doctrine'],
  authors: [{ name: 'Agents of Faith' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
