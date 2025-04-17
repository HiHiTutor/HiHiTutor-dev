'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    pendingCases: 0,
    latestCases: 0
  });

  useEffect(() => {
    // TODO: 串接真實後端 API
    setStats({
      totalUsers: 1530,
      totalStudents: 1200,
      totalTutors: 330,
      pendingCases: 21,
      latestCases: 9
    });
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1>後台總覽 Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>總用戶數</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>學生人數</h3>
          <p>{stats.totalStudents}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>導師人數</h3>
          <p>{stats.totalTutors}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>待審核個案</h3>
          <p>{stats.pendingCases}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h3>最新個案（顯示中）</h3>
          <p>{stats.latestCases}</p>
        </div>
      </div>
    </div>
  );
}
