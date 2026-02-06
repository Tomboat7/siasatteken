import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI献立プランナー - siasatteken',
  description: 'OpenAI APIを使った栄養バランス最適化献立作成アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
