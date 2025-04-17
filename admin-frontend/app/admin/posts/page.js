'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const AdminPostList = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    status: '',
    verified: '',
    sort: '-createdAt'
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/posts', { params: searchParams });
      setPosts(response.data.posts);
    } catch (err) {
      setError(err.response?.data?.message || '獲取貼文列表失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchParams({
      status: formData.get('status'),
      verified: formData.get('verified'),
      sort: formData.get('sort')
    });
  };

  const handleVerifyPost = async (postId, verified) => {
    try {
      await api.patch(`/api/posts/${postId}/verify`, { verified });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || '更新貼文狀態失敗');
    }
  };

  const handleUpdateStatus = async (postId, status) => {
    try {
      await api.patch(`/api/posts/${postId}/verify`, { status });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || '更新貼文狀態失敗');
    }
  };

  const handleUpdateAdLevel = async (postId, adLevel) => {
    try {
      await api.patch(`/api/posts/${postId}/verify`, { adLevel });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || '更新廣告等級失敗');
    }
  };

  const handleViewPost = async (postId) => {
    try {
      const response = await api.get(`/api/posts/${postId}`);
      const post = response.data;
      alert(`
標題：${post.title}
科目：${post.subjects.join(', ')}
地區：${post.locations.join(', ')}
堂費：${post.fee}/小時
教學經驗：${post.experience}
學歷：${post.education}
詳細介紹：${post.description}
性別偏好：${post.genderPreference === 'any' ? '不限' : post.genderPreference === 'male' ? '男' : '女'}
      `);
    } catch (err) {
      alert(err.response?.data?.message || '獲取貼文詳情失敗');
    }
  };

  if (loading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        錯誤: {error}
        <button
          onClick={fetchPosts}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">導師貼文管理</h1>

      {/* 搜尋表單 */}
      <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">狀態</label>
          <select
            name="status"
            defaultValue={searchParams.status}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">全部</option>
            <option value="active">啟用</option>
            <option value="inactive">停用</option>
            <option value="deleted">已刪除</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">審核狀態</label>
          <select
            name="verified"
            defaultValue={searchParams.verified}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">全部</option>
            <option value="true">已審核</option>
            <option value="false">未審核</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">排序</label>
          <select
            name="sort"
            defaultValue={searchParams.sort}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="-createdAt">最新優先</option>
            <option value="createdAt">最舊優先</option>
            <option value="-adLevel">廣告等級優先</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            搜尋
          </button>
        </div>
      </form>

      {/* 貼文列表 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                標題
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                導師
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                審核狀態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                廣告等級
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map(post => (
              <tr key={post._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{post.tutor.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={post.status}
                    onChange={(e) => handleUpdateStatus(post._id, e.target.value)}
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="active">啟用</option>
                    <option value="inactive">停用</option>
                    <option value="deleted">刪除</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleVerifyPost(post._id, !post.verified)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.verified ? '已審核' : '未審核'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={post.adLevel}
                    onChange={(e) => handleUpdateAdLevel(post._id, Number(e.target.value))}
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="0">一般</option>
                    <option value="1">置頂</option>
                    <option value="2">精選</option>
                    <option value="3">熱門</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleViewPost(post._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    查看詳情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPostList; 