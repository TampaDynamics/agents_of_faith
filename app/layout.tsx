import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-YW5F0F2J1M';
  
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
