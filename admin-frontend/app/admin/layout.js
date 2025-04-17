// app/admin/layout.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  // 如果是登入頁面，不顯示導航欄
  if (pathname === '/admin/login') {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 頂部導航欄 */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              HiHiTutor 管理後台
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/admin/dashboard" 
              className={`hover:text-blue-200 ${pathname === '/admin/dashboard' ? 'font-bold' : ''}`}
            >
              總覽
            </Link>
            <Link 
              href="/admin/users" 
              className={`hover:text-blue-200 ${pathname === '/admin/users' ? 'font-bold' : ''}`}
            >
              用戶管理
            </Link>
            <Link 
              href="/admin/cases" 
              className={`hover:text-blue-200 ${pathname === '/admin/cases' ? 'font-bold' : ''}`}
            >
              個案管理
            </Link>
            <Link 
              href="/admin/ads" 
              className={`hover:text-blue-200 ${pathname === '/admin/ads' ? 'font-bold' : ''}`}
            >
              廣告管理
            </Link>
            <Link 
              href="/admin/stats" 
              className={`hover:text-blue-200 ${pathname === '/admin/stats' ? 'font-bold' : ''}`}
            >
              統計資料
            </Link>
          </nav>
          <div>
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminUser');
                  window.location.href = '/admin/login';
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
              >
                登出
              </button>
            ) : (
              <Link 
                href="/admin/login" 
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* 頁腳 */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} HiHiTutor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 