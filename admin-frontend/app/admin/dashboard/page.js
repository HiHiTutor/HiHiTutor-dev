'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    pendingCases: 0,
    latestCases: 0,
    totalAds: 0,
    monthlyStats: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch('https://hihitutor-dev-backend.onrender.com/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            router.push('/admin/login');
            return;
          }
          throw new Error('無法獲取統計數據');
        }

        const data = await response.json();
        
        // 處理月度數據
        const monthlyData = data.monthlyStats || [];
        
        setStats({
          totalUsers: data.totalUsers || 0,
          totalStudents: data.totalStudents || 0,
          totalTutors: data.totalTutors || 0,
          pendingCases: data.pendingCases || 0,
          latestCases: data.latestCases || 0,
          totalAds: data.totalAds || 0,
          monthlyStats: monthlyData
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('獲取數據時發生錯誤，請稍後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleViewMore = (path) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-md">
        <h3 className="text-red-800">{error}</h3>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">後台總覽 Dashboard</h1>
      
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700">總用戶數</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalUsers}</p>
          <button 
            onClick={() => handleViewMore('/admin/users')}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            查看詳情 →
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700">學生人數</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalStudents}</p>
          <button 
            onClick={() => handleViewMore('/admin/users?role=student')}
            className="mt-4 text-green-600 hover:text-green-800"
          >
            查看詳情 →
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700">導師人數</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTutors}</p>
          <button 
            onClick={() => handleViewMore('/admin/users?role=tutor')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            查看詳情 →
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700">待審核個案</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingCases}</p>
          <button 
            onClick={() => handleViewMore('/admin/cases?status=pending')}
            className="mt-4 text-yellow-600 hover:text-yellow-800"
          >
            查看詳情 →
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700">最新個案</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.latestCases}</p>
          <button 
            onClick={() => handleViewMore('/admin/cases')}
            className="mt-4 text-purple-600 hover:text-purple-800"
          >
            查看詳情 →
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700">廣告總數</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.totalAds}</p>
          <button 
            onClick={() => handleViewMore('/admin/ads')}
            className="mt-4 text-red-600 hover:text-red-800"
          >
            查看詳情 →
          </button>
        </div>
      </div>
      
      {/* 圖表 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">月度統計</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.monthlyStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" name="用戶" fill="#4F46E5" />
              <Bar dataKey="cases" name="個案" fill="#10B981" />
              <Bar dataKey="ads" name="廣告" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
