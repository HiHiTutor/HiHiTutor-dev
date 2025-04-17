// app/layout.js
import './globals.css';

export const metadata = {
  title: 'HiHiTutor Admin',
  description: 'HiHiTutor 管理後台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
} 