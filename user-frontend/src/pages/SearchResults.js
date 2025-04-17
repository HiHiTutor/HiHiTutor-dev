import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({
    posts: [],
    cases: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          location: searchParams.get('location'),
          subject: searchParams.get('subject'),
          role: searchParams.get('role'),
          genderPreference: searchParams.get('genderPreference')
        };

        // 根據角色參數決定要獲取哪些結果
        const promises = [];
        if (!params.role || params.role === 'tutor') {
          promises.push(api.get('/api/posts', { params }));
        }
        if (!params.role || params.role === 'student') {
          promises.push(api.get('/api/cases', { params }));
        }

        const responses = await Promise.all(promises);
        setResults({
          posts: responses[0]?.data?.posts || [],
          cases: responses[1]?.data?.cases || []
        });
      } catch (err) {
        setError(err.response?.data?.message || '獲取搜尋結果失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

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
      <h1 className="text-2xl font-bold mb-8">搜尋結果</h1>

      {/* 導師貼文結果 */}
      {results.posts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">導師貼文</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.posts.map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>科目：{post.subjects.join(', ')}</p>
                  <p>地區：{post.locations.join(', ')}</p>
                  <p>堂費：${post.fee}/小時</p>
                  <p>性別偏好：{
                    post.genderPreference === 'any' ? '不限' :
                    post.genderPreference === 'male' ? '男' : '女'
                  }</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.href = `/posts/${post._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    查看詳情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 學生個案結果 */}
      {results.cases.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">學生個案</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.cases.map(case_ => (
              <div key={case_._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">{case_.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>科目：{case_.subject}</p>
                  <p>地區：{case_.location}</p>
                  <p>堂費：${case_.fee}/小時</p>
                  <p>要求：{case_.requirements}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.href = `/cases/${case_._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    查看詳情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 無結果提示 */}
      {results.posts.length === 0 && results.cases.length === 0 && (
        <div className="text-center text-gray-600">
          沒有找到符合條件的結果
        </div>
      )}
    </div>
  );
};

export default SearchResults; 