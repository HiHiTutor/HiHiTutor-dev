import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CaseList = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedCases, setAppliedCases] = useState(new Set());

  // 獲取已審核的個案列表
  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/cases?verified=true');
      setCases(response.data);
    } catch (err) {
      console.error('獲取個案列表失敗:', err);
      setError(err.message || '獲取個案列表失敗');
    } finally {
      setLoading(false);
    }
  };

  // 獲取已申請的個案
  const fetchAppliedCases = async () => {
    try {
      const response = await api.get('/api/cases/applied');
      const appliedIds = new Set(response.data.map(case => case.id));
      setAppliedCases(appliedIds);
    } catch (err) {
      console.error('獲取已申請個案失敗:', err);
    }
  };

  // 申請個案
  const handleApply = async (caseId) => {
    try {
      await api.post(`/api/cases/${caseId}/apply`);
      setAppliedCases(prev => new Set([...prev, caseId]));
      alert('申請成功！');
    } catch (err) {
      alert(err.response?.data?.message || '申請失敗，請稍後再試');
    }
  };

  useEffect(() => {
    fetchCases();
    if (user?.role === 'tutor') {
      fetchAppliedCases();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        錯誤: {error}
        <button 
          onClick={fetchCases}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">補習個案列表</h2>
      <div className="space-y-6">
        {cases.length > 0 ? (
          cases.map(caseItem => (
            <div key={caseItem.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{caseItem.title}</h3>
                  <p className="text-gray-600 mt-1">科目：{caseItem.subject}</p>
                  <p className="text-gray-600">地區：{caseItem.location}</p>
                  <p className="text-gray-600">堂費：${caseItem.fee}/小時</p>
                </div>
                {user?.role === 'tutor' && (
                  <button
                    onClick={() => handleApply(caseItem.id)}
                    disabled={appliedCases.has(caseItem.id)}
                    className={`px-4 py-2 rounded-md ${
                      appliedCases.has(caseItem.id)
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {appliedCases.has(caseItem.id) ? '已申請' : '申請個案'}
                  </button>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium">要求：</h4>
                <p className="text-gray-700 mt-1">{caseItem.requirements}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium">上課時間：</h4>
                <p className="text-gray-700 mt-1">{caseItem.schedule}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium">聯絡方式：</h4>
                <p className="text-gray-700 mt-1">{caseItem.contact}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600">
            暫無可用的補習個案
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseList; 