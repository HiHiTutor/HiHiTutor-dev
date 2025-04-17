'use client';
import { useEffect, useState } from 'react';
import { caseAPI } from '@/services/api';

export default function AdminCaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取個案列表
  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await caseAPI.getCases();
      setCases(data);
    } catch (err) {
      console.error('獲取個案列表失敗:', err);
      setError(err.message || '獲取個案列表失敗');
    } finally {
      setLoading(false);
    }
  };

  // 更新個案狀態（審核）
  const handleVerifyCase = async (caseId) => {
    try {
      await caseAPI.updateCaseStatus(caseId, { verified: true });
      // 重新獲取個案列表
      fetchCases();
      alert('個案審核成功');
    } catch (err) {
      console.error('審核個案失敗:', err);
      alert(err.message || '審核個案失敗');
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
      alert(err.message || '獲取個案詳情失敗');
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  if (loading) {
    return <div style={{ padding: 30 }}>載入中...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 30, color: 'red' }}>
        錯誤: {error}
        <button 
          onClick={fetchCases}
          style={{ marginLeft: 10, padding: '5px 10px' }}
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>個案管理</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: 20 }}>
        <thead>
          <tr>
            <th>個案標題</th>
            <th>發佈類型</th>
            <th>收費</th>
            <th>審核狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {cases.length > 0 ? (
            cases.map(cs => (
              <tr key={cs.id}>
                <td>{cs.title}</td>
                <td>{cs.type}</td>
                <td>{cs.fee}</td>
                <td>{cs.verified ? '已審核' : '待審核'}</td>
                <td>
                  <button onClick={() => handleViewCase(cs.id)}>查看</button>
                  {!cs.verified && (
                    <button 
                      style={{ marginLeft: 10 }} 
                      onClick={() => handleVerifyCase(cs.id)}
                    >
                      通過審核
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>暫無個案數據</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
