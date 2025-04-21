'use client';
import { useEffect, useState } from 'react';
import { caseAPI } from '@/services/api';

export default function AdminCaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await caseAPI.getAll();
        setCases(data);
      } catch (err) {
        console.error('獲取個案列表失敗:', err);
        setError(err.response?.data?.message || err.message || '獲取個案列表失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // 更新個案狀態（審核）
  const handleVerifyCase = async (caseId) => {
    try {
      await caseAPI.updateCaseStatus(caseId, { verified: true });
      // 重新獲取個案列表
      fetchCases();
      alert('個案審核成功');
    } catch (err) {
      console.error('審核個案失敗:', err);
      alert(err.response?.data?.message || err.message || '審核個案失敗');
    }
  };

  // 查看個案詳情
  const handleViewCase = async (caseId) => {
    try {
      const caseData = await caseAPI.getCase(caseId);
      // 這裡可以顯示個案詳情，例如使用模態框
      alert(`個案詳情: ${JSON.stringify(caseData, null, 2)}`);
    } catch (err) {
      console.error('獲取個案詳情失敗:', err);
      alert(err.response?.data?.message || err.message || '獲取個案詳情失敗');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={fetchCases}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">個案管理</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">個案標題</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">發佈類型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">收費</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">審核狀態</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cases.length > 0 ? (
              cases.map(cs => (
                <tr key={cs.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cs.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cs.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cs.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cs.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cs.verified ? '已審核' : '待審核'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewCase(cs.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      查看
                    </button>
                    {!cs.verified && (
                      <button
                        onClick={() => handleVerifyCase(cs.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        通過審核
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  暫無個案數據
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
