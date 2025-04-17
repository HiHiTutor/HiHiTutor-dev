// app/layout.js
export const metadata = {
  title: 'HiHiTutor Admin',
  description: 'HiHiTutor 管理後台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 