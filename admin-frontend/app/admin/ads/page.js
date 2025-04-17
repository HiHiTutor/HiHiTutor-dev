'use client';
import { useEffect, useState } from 'react';
import { adAPI } from '../../services/api';

export default function AdminAdList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取廣告列表
  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adAPI.getAds();
      setAds(data);
    } catch (err) {
      console.error('獲取廣告列表失敗:', err);
      setError(err.message || '獲取廣告列表失敗');
    } finally {
      setLoading(false);
    }
  };

  // 更新廣告狀態（啟用/停用）
  const handleToggleAdStatus = async (adId, currentStatus) => {
    try {
      await adAPI.updateAdStatus(adId, !currentStatus);
      // 重新獲取廣告列表
      fetchAds();
      alert(`廣告已${!currentStatus ? '啟用' : '停用'}`);
    } catch (err) {
      console.error('更新廣告狀態失敗:', err);
      alert(err.message || '更新廣告狀態失敗');
    }
  };

  // 查看廣告詳情
  const handleViewAd = async (adId) => {
    try {
      const ad = await adAPI.getAd(adId);
      // 這裡可以顯示廣告詳情，例如使用模態框
      alert(`廣告詳情: ${JSON.stringify(ad, null, 2)}`);
    } catch (err) {
      console.error('獲取廣告詳情失敗:', err);
      alert(err.message || '獲取廣告詳情失敗');
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  if (loading) {
    return <div style={{ padding: 30 }}>載入中...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 30, color: 'red' }}>
        錯誤: {error}
        <button 
          onClick={fetchAds}
          style={{ marginLeft: 10, padding: '5px 10px' }}
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>廣告管理</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: 20 }}>
        <thead>
          <tr>
            <th>廣告商名稱</th>
            <th>套餐類型</th>
            <th>連結</th>
            <th>顯示模式</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {ads.length > 0 ? (
            ads.map(ad => (
              <tr key={ad.id}>
                <td>{ad.name}</td>
                <td>{ad.type}</td>
                <td><a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a></td>
                <td>{ad.mode}</td>
                <td>{ad.active ? '啟用中' : '已停用'}</td>
                <td>
                  <button onClick={() => handleViewAd(ad.id)}>查看</button>
                  <button 
                    style={{ marginLeft: 10 }} 
                    onClick={() => handleToggleAdStatus(ad.id, ad.active)}
                  >
                    {ad.active ? '停用' : '啟用'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>暫無廣告數據</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
