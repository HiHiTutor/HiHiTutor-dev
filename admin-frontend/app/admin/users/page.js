'use client';
import { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取用戶列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('獲取用戶列表失敗:', err);
      setError(err.message || '獲取用戶列表失敗');
    } finally {
      setLoading(false);
    }
  };

  // 更新用戶狀態（審核）
  const handleVerifyUser = async (userId) => {
    try {
      await userAPI.updateUserStatus(userId, { verified: true });
      // 重新獲取用戶列表
      fetchUsers();
      alert('用戶審核成功');
    } catch (err) {
      console.error('審核用戶失敗:', err);
      alert(err.message || '審核用戶失敗');
    }
  };

  // 查看用戶詳情
  const handleViewUser = async (userId) => {
    try {
      const user = await userAPI.getUser(userId);
      // 這裡可以顯示用戶詳情，例如使用模態框
      alert(`用戶詳情: ${JSON.stringify(user, null, 2)}`);
    } catch (err) {
      console.error('獲取用戶詳情失敗:', err);
      alert(err.message || '獲取用戶詳情失敗');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div style={{ padding: 30 }}>載入中...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 30, color: 'red' }}>
        錯誤: {error}
        <button 
          onClick={fetchUsers}
          style={{ marginLeft: 10, padding: '5px 10px' }}
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>用戶管理</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: 20 }}>
        <thead>
          <tr>
            <th>用戶名稱</th>
            <th>電話號碼</th>
            <th>身份</th>
            <th>是否審核</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.verified ? '已審核' : '待審核'}</td>
                <td>
                  <button onClick={() => handleViewUser(user.id)}>查看</button>
                  {!user.verified && (
                    <button 
                      style={{ marginLeft: 10 }} 
                      onClick={() => handleVerifyUser(user.id)}
                    >
                      通過審核
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>暫無用戶數據</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
