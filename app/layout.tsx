import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HealthTracker - Your Health Journey',
  description: 'Track your health, monitor vital signs, and maintain wellness records with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}