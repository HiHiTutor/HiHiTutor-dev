'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      setError('Error fetching statistics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return null;

  const monthlyData = [
    {
      name: 'Users',
      value: stats.monthly.newUsers
    },
    {
      name: 'Cases',
      value: stats.monthly.newCases
    },
    {
      name: 'Applications',
      value: stats.monthly.newApplications
    },
    {
      name: 'Ad Clicks',
      value: stats.monthly.adClicks
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Statistics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <div className="space-y-2">
            <p>Total: {stats.users.total}</p>
            <p>Students: {stats.users.students}</p>
            <p>Tutors: {stats.users.tutors}</p>
            <p>Verified Tutors: {stats.users.verifiedTutors}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Cases</h3>
          <div className="space-y-2">
            <p>Total: {stats.cases.total}</p>
            <p>Verified: {stats.cases.verified}</p>
            <p>Active: {stats.cases.active}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Applications</h3>
          <div className="space-y-2">
            <p>Total: {stats.applications.total}</p>
            <p>Approved: {stats.applications.approved}</p>
            <p>Pending: {stats.applications.pending}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Advertisements</h3>
          <div className="space-y-2">
            <p>Total: {stats.advertisements.total}</p>
            <p>Active: {stats.advertisements.active}</p>
            <p>Total Clicks: {stats.advertisements.totalClicks}</p>
          </div>
        </div>
      </div>

      {/* Monthly Statistics Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Statistics</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 