import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [data, setData] = useState({
    recommendedTutors: [],
    latestCases: [],
    tutorPosts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 獲取推薦導師（已驗證且評分高的導師）
        const tutorsResponse = await api.get('/api/users/tutors', {
          params: {
            verified: true,
            sort: '-rating',
            limit: 6
          }
        });

        // 獲取最新個案
        const casesResponse = await api.get('/api/cases', {
          params: {
            verified: true,
            sort: '-createdAt',
            limit: 6
          }
        });

        // 獲取導師貼文（按廣告等級排序）
        const postsResponse = await api.get('/api/posts', {
          params: {
            verified: true,
            status: 'active',
            sort: '-adLevel,-createdAt',
            limit: 6
          }
        });

        setData({
          recommendedTutors: tutorsResponse.data.users || [],
          latestCases: casesResponse.data.cases || [],
          tutorPosts: postsResponse.data.posts || []
        });
      } catch (err) {
        setError(err.response?.data?.message || '獲取數據失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 推薦導師 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">推薦導師</h2>
          <Link
            to="/tutors"
            className="text-indigo-600 hover:text-indigo-800"
          >
            顯示更多
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.recommendedTutors.map(tutor => (
            <div key={tutor._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{tutor.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>科目：{tutor.subjects?.join(', ')}</p>
                <p>地區：{tutor.locations?.join(', ')}</p>
                <p>評分：{tutor.rating?.toFixed(1) || '暫無評分'}</p>
              </div>
              <div className="mt-4">
                <Link
                  to={`/tutors/${tutor._id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  查看詳情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 最新個案 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">最新個案</h2>
          <Link
            to="/cases"
            className="text-indigo-600 hover:text-indigo-800"
          >
            顯示更多
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.latestCases.map(case_ => (
            <div key={case_._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{case_.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>科目：{case_.subject}</p>
                <p>地區：{case_.location}</p>
                <p>堂費：${case_.fee}/小時</p>
              </div>
              <div className="mt-4">
                <Link
                  to={`/cases/${case_._id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  查看詳情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 導師貼文 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">導師招學生</h2>
          <Link
            to="/posts"
            className="text-indigo-600 hover:text-indigo-800"
          >
            顯示更多
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.tutorPosts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>科目：{post.subjects.join(', ')}</p>
                <p>地區：{post.locations.join(', ')}</p>
                <p>堂費：${post.fee}/小時</p>
              </div>
              <div className="mt-4">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  查看詳情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 