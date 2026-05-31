import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import QueryProvider from '@/providers/QueryProvider';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ClientPulse',
  description:
    'ClientPulse is an AI-driven operating system for local businesses — manage customer relationships, automate workflows, and unify your integrations in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistMono.variable} h-full font-sans antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
