'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    // 檢查是否已登入，如果未登入則重定向到登入頁面
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">HiHiTutor 管理後台</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">用戶管理</h2>
          <p className="text-gray-600 mb-4">管理學生和導師帳戶</p>
          <a 
            href="/admin/users" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            查看用戶
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">個案管理</h2>
          <p className="text-gray-600 mb-4">審核和管理學生個案</p>
          <a 
            href="/admin/cases" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            查看個案
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">貼文管理</h2>
          <p className="text-gray-600 mb-4">審核和管理導師貼文</p>
          <a 
            href="/admin/posts" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            查看貼文
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">廣告管理</h2>
          <p className="text-gray-600 mb-4">管理網站廣告</p>
          <a 
            href="/admin/ads" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            查看廣告
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">統計數據</h2>
          <p className="text-gray-600 mb-4">查看系統使用統計</p>
          <a 
            href="/admin/stats" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            查看統計
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">儀表板</h2>
          <p className="text-gray-600 mb-4">查看系統概況</p>
          <a 
            href="/admin/dashboard" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            查看儀表板
          </a>
        </div>
      </div>
    </div>
  );
} 