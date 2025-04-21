'use client';

import { useState, useEffect } from 'react';
import axios from '@/services/axios';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalCases: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || '無法載入統計資料');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">儀表板</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">總用戶數</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">總導師數</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalTutors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">總案件數</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalCases}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">總申請數</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalApplications}</p>
        </div>
      </div>
    </div>
  );
}
