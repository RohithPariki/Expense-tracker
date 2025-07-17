// ExpenseChart.jsx - Enhanced with better light mode styling
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Filter, Download, RefreshCw } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ExpenseChart = ({ transactions = [] }) => {
  const [chartData, setChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hiddenSegments, setHiddenSegments] = useState(new Set());
  const [viewMode, setViewMode] = useState('pie'); // 'pie' or 'bar'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'month', 'week'
  const [animationKey, setAnimationKey] = useState(0);
  const [insights, setInsights] = useState({});
  const chartRef = useRef(null);

  // Enhanced color palette with gradients
  const colorPalette = [
    { bg: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' },
    { bg: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' },
    { bg: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { bg: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' },
    { bg: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' },
    { bg: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' },
    { bg: '#F97316', gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' },
    { bg: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)' },
    { bg: '#84CC16', gradient: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)' },
    { bg: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' },
  ];

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t => t.type === 'expense');
    
    if (timeFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
    } else if (timeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    }
    
    return filtered;
  }, [transactions, timeFilter]);

  const processedData = useMemo(() => {
    if (!filteredTransactions.length) return null;

    const categoryData = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { amount: 0, count: 0, transactions: [] };
      }
      acc[category].amount += parseFloat(transaction.amount);
      acc[category].count += 1;
      acc[category].transactions.push(transaction);
      return acc;
    }, {});

    // Sort by amount (highest first) - keeping this as default
    const sortedCategories = Object.entries(categoryData).sort((a, b) => b[1].amount - a[1].amount);

    const categories = sortedCategories.map(([cat]) => cat);
    const amounts = sortedCategories.map(([, data]) => data.amount);
    const counts = sortedCategories.map(([, data]) => data.count);

    return { categories, amounts, counts, categoryData };
  }, [filteredTransactions]);

  const calculateInsights = useMemo(() => {
    if (!processedData) return {};

    const { amounts, categoryData } = processedData;
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / amounts.length;
    const highest = Math.max(...amounts);
    const lowest = Math.min(...amounts);
    const highestCategory = processedData.categories[amounts.indexOf(highest)];
    const lowestCategory = processedData.categories[amounts.indexOf(lowest)];

    return {
      total,
      average,
      highest,
      lowest,
      highestCategory,
      lowestCategory,
      categoryCount: amounts.length,
      transactionCount: filteredTransactions.length,
    };
  }, [processedData, filteredTransactions]);

  useEffect(() => {
    setIsLoading(true);
    
    if (processedData) {
      const { categories, amounts, counts } = processedData;
      
      const visibleAmounts = amounts.map((amount, index) => 
        hiddenSegments.has(index) ? 0 : amount
      );
      
      const visibleCounts = counts.map((count, index) => 
        hiddenSegments.has(index) ? 0 : count
      );

      const backgroundColors = categories.map((_, index) => 
        hiddenSegments.has(index) ? '#94A3B8' : colorPalette[index % colorPalette.length].bg
      );

      // Pie chart data
      setChartData({
        labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
        datasets: [
          {
            data: visibleAmounts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color),
            borderWidth: 3,
            hoverBorderWidth: 4,
            hoverBorderColor: '#FFFFFF',
            hoverBackgroundColor: backgroundColors.map(color => color + 'DD'),
          },
        ],
      });

      // Bar chart data
      setBarChartData({
        labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
        datasets: [
          {
            label: 'Amount ($)',
            data: visibleAmounts,
            backgroundColor: backgroundColors.map(color => color + '80'),
            borderColor: backgroundColors,
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Transactions',
            data: visibleCounts,
            backgroundColor: backgroundColors.map(color => color + '40'),
            borderColor: backgroundColors,
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
            yAxisID: 'y1',
          },
        ],
      });

      setInsights(calculateInsights);
    } else {
      setChartData(null);
      setBarChartData(null);
    }
    
    setIsLoading(false);
  }, [processedData, hiddenSegments, calculateInsights]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: 'Inter, sans-serif',
            size: 16,
            weight: '600',
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const originalValue = processedData.amounts[i];
                const total = processedData.amounts.reduce((a, b) => a + b, 0);
                const percentage = ((originalValue / total) * 100).toFixed(1);
                const isHidden = hiddenSegments.has(i);
                
                return {
                  text: `${label} - $${originalValue.toFixed(2)} (${percentage}%)`,
                  fillStyle: isHidden ? '#94A3B8' : dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: 2,
                  pointStyle: 'circle',
                  hidden: isHidden,
                  index: i,
                };
              });
            }
            return [];
          },
        },
        onClick: (event, legendItem) => {
          const index = legendItem.index;
          const newHiddenSegments = new Set(hiddenSegments);
          
          if (newHiddenSegments.has(index)) {
            newHiddenSegments.delete(index);
          } else {
            newHiddenSegments.add(index);
          }
          
          setHiddenSegments(newHiddenSegments);
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#F1F5F9',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: '600',
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 14,
          weight: '500',
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = processedData.amounts[context.dataIndex];
            const total = processedData.amounts.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            const count = processedData.counts[context.dataIndex];
            return [
              `${label}: $${value.toFixed(2)} (${percentage}%)`,
              `Transactions: ${count}`
            ];
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 16,
            weight: '600',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#F1F5F9',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Amount ($)') {
              return `${label}: $${value.toFixed(2)}`;
            } else {
              return `${label}: ${value}`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
          font: {
            family: 'Inter, sans-serif',
            size: 14,
            weight: '600',
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Transaction Count',
          font: {
            family: 'Inter, sans-serif',
            size: 14,
            weight: '600',
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
      },
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
  };

  const refreshChart = () => {
    setAnimationKey(prev => prev + 1);
    setHiddenSegments(new Set());
  };

  const downloadChart = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const link = document.createElement('a');
      link.download = `expense-chart-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Add CSS for better legend colors in dark mode
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dark .chartjs-legend-item {
        color: #F8FAFC !important;
      }
      .dark .chartjs-legend-item:hover {
        color: #FFFFFF !important;
      }
      .dark .chartjs-legend-item.chartjs-legend-item-hidden {
        color: #94A3B8 !important;
      }
      .light .chartjs-legend-item {
        color: #1E293B !important;
      }
      .light .chartjs-legend-item:hover {
        color: #0F172A !important;
      }
      .light .chartjs-legend-item.chartjs-legend-item-hidden {
        color: #94A3B8 !important;
      }
      
      /* Target Chart.js legend items more specifically */
      .dark canvas + div .chartjs-legend-item {
        color: #F8FAFC !important;
      }
      .dark canvas + div .chartjs-legend-item:hover {
        color: #FFFFFF !important;
      }
      .dark canvas + div .chartjs-legend-item.chartjs-legend-item-hidden {
        color: #94A3B8 !important;
      }
      
      /* Additional targeting for Chart.js legend */
      .dark .chartjs-legend-item text {
        fill: #F8FAFC !important;
      }
      .dark .chartjs-legend-item:hover text {
        fill: #FFFFFF !important;
      }
      .dark .chartjs-legend-item.chartjs-legend-item-hidden text {
        fill: #94A3B8 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        className="w-full h-screen flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500 border-b-transparent rounded-full animate-spin animate-reverse m-2"></div>
        </div>
        <p className="text-blue-700 dark:text-blue-400 font-medium text-xl mt-6">
          Analyzing expenses...
        </p>
      </motion.div>
    );
  }

  if (!chartData || filteredTransactions.length === 0) {
    return (
      <motion.div 
        className="w-full h-screen flex flex-col items-center justify-center text-center p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-8 shadow-lg">
          <PieChart className="w-20 h-20 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-4xl font-bold text-blue-900 dark:text-slate-200 mb-6">
          No Expense Data Available
        </h3>
        <p className="text-blue-700 dark:text-slate-400 text-xl max-w-2xl leading-relaxed">
          Add some expense transactions to see detailed analytics and insights about your spending patterns.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full h-screen flex flex-col"
      key={animationKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with Controls - Compact */}
      <motion.div 
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mx-4 mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h3 className="text-2xl font-bold text-blue-900 dark:text-slate-200 mb-1">
            Expense Analytics
          </h3>
          <p className="text-blue-700 dark:text-slate-400 text-base">
            Advanced insights into your spending patterns
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Time Filter */}
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-1.5 bg-blue-50 dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-lg text-blue-900 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
          </select>

          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pie')}
              className={`px-2 py-1 rounded-md transition-all duration-200 ${
                viewMode === 'pie' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <PieChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-2 py-1 rounded-md transition-all duration-200 ${
                viewMode === 'bar' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={refreshChart}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-purple-900 dark:text-purple-300 font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 flex items-center gap-1 text-sm"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
          
          <button
            onClick={downloadChart}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg text-indigo-900 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200 flex items-center gap-1 text-sm"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Insights Cards - Compact */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mx-4 mt-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">TOTAL</span>
          </div>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
            ${insights.total?.toFixed(2) || '0.00'}
          </p>
          <p className="text-blue-700 dark:text-blue-400 text-xs">
            {insights.transactionCount || 0} transactions
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 text-xs font-semibold">HIGHEST</span>
          </div>
          <p className="text-xl font-bold text-green-900 dark:text-green-300">
            ${insights.highest?.toFixed(2) || '0.00'}
          </p>
          <p className="text-green-700 dark:text-green-400 text-xs">
            {insights.highestCategory || 'N/A'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <TrendingDown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold">LOWEST</span>
          </div>
          <p className="text-xl font-bold text-amber-900 dark:text-amber-300">
            ${insights.lowest?.toFixed(2) || '0.00'}
          </p>
          <p className="text-amber-700 dark:text-amber-400 text-xs">
            {insights.lowestCategory || 'N/A'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400 text-xs font-semibold">AVERAGE</span>
          </div>
          <p className="text-xl font-bold text-purple-900 dark:text-purple-300">
            ${insights.average?.toFixed(2) || '0.00'}
          </p>
          <p className="text-purple-700 dark:text-purple-400 text-xs">
            {insights.categoryCount || 0} categories
          </p>
        </div>
      </motion.div>

      {/* Chart Container - Takes up remaining space */}
      <motion.div 
        className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mx-4 mt-3 mb-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            {viewMode === 'pie' ? (
              <motion.div
                key="pie"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <Pie ref={chartRef} data={chartData} options={pieOptions} />
              </motion.div>
            ) : (
              <motion.div
                key="bar"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <Bar ref={chartRef} data={barChartData} options={barOptions} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseChart;