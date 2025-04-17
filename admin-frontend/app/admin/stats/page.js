'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Skeleton, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import statsAPI from '../../../services/api';

// 自定義主題
const theme = {
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

// 骨架屏組件
const StatsSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3, 4].map((item) => (
      <Grid item xs={12} sm={6} md={3} key={item}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={36} />
          </CardContent>
        </Card>
      </Grid>
    ))}
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Skeleton variant="rectangular" height={400} />
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statsAPI.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message || '獲取統計數據失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <StatsSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 準備圖表數據
  const chartData = stats?.monthlyStats?.map(item => ({
    name: item.month,
    用戶數: item.userCount,
    案件數: item.caseCount,
    申請數: item.applicationCount,
  })) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        統計數據
      </Typography>
      
      <Grid container spacing={3}>
        {/* 統計卡片 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                總用戶數
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {stats?.totalUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                總案件數
              </Typography>
              <Typography variant="h4" component="div" color="secondary">
                {stats?.totalCases || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                總申請數
              </Typography>
              <Typography variant="h4" component="div" color="success">
                {stats?.totalApplications || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                活躍用戶數
              </Typography>
              <Typography variant="h4" component="div" color="info">
                {stats?.activeUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 圖表 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                月度統計
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="用戶數" fill={theme.colors.primary} />
                    <Bar dataKey="案件數" fill={theme.colors.secondary} />
                    <Bar dataKey="申請數" fill={theme.colors.success} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 