// components/Charts/ExpenseChart.jsx

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        // const res = await api.get('/transactions/stats ');
        const res = await getStats(); // Use the getStats function from api.js
        // Try to get stats from either res.data.data.categoryStats or res.data.categoryStats
    
        const categoryStats = res.data.data?.categoryStats || res.data.categoryStats || [];

        // Filter for only expense categories
        const expenseStats = categoryStats.filter(
          item => (item.type || 'expense') === 'expense'
        );

        if (expenseStats.length > 0) {
          const labels = expenseStats.map(item => item._id  || item.category || 'Unknown Category');
          const data = expenseStats.map(item => Math.abs(item.total || item.amount));
          const backgroundColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#00C49F', '#FF8042'
          ];

          setChartData({
            labels,
            datasets: [{
              label: 'Expense Breakdown',
              data,
              backgroundColor: backgroundColors.slice(0, labels.length),
              borderWidth: 1,
            }]
          });
        } else {
          setChartData(null);
        }
      } catch (error) {
        console.error('Failed to load chart data', error);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
        <p className="text-center">Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default ExpenseChart;
