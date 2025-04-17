import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">管理員儀表板</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              登出
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-medium text-gray-900 mb-2">管理員資訊</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">管理員 ID</p>
                <p className="mt-1 text-sm text-gray-900">{user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">電子郵件</p>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">角色</p>
                <p className="mt-1 text-sm text-gray-900">{user.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">註冊時間</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleString('zh-TW')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">管理功能</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-indigo-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-indigo-900">用戶管理</h3>
                <p className="mt-1 text-sm text-indigo-700">
                  管理系統中的所有用戶帳號
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-green-900">課程管理</h3>
                <p className="mt-1 text-sm text-green-700">
                  管理所有課程和教學內容
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-purple-900">系統設定</h3>
                <p className="mt-1 text-sm text-purple-700">
                  配置系統參數和權限
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 