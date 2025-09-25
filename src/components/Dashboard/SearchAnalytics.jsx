import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SearchAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('volume');

  useEffect(() => {
    fetchSearchAnalytics();
  }, []);

  const fetchSearchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/searches');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching search analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-500">
        <div className="text-center">
          <p>Error loading search analytics</p>
          <button
            onClick={fetchSearchAnalytics}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No search analytics data available
      </div>
    );
  }

  // Chart configurations
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Search Volume Line Chart
  const volumeData = {
    labels: data.searchVolume
      .map(item =>
        new Date(item.search_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
      .reverse(),
    datasets: [
      {
        label: 'Daily Searches',
        data: data.searchVolume.map(item => parseInt(item.search_count)).reverse(),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Top Terms Bar Chart
  const termsData = {
    labels: data.topTerms.map(item =>
      item.term.length > 15 ? item.term.substring(0, 15) + '...' : item.term
    ),
    datasets: [
      {
        label: 'Search Count',
        data: data.topTerms.map(item => parseInt(item.search_count)),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Languages Pie Chart
  const languagesData = {
    labels: data.languages.map(item =>
      item.language === 'unknown' ? 'Unknown' : item.language.toUpperCase()
    ),
    datasets: [
      {
        data: data.languages.map(item => parseInt(item.search_count)),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Search Engines Pie Chart
  const enginesData = {
    labels: data.searchEngines.map(item => (item.engine === 'google' ? 'Google' : 'Baidu')),
    datasets: [
      {
        data: data.searchEngines.map(item => parseInt(item.search_count)),
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieOptions = {
    ...commonOptions,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'volume':
        return <Line data={volumeData} options={commonOptions} />;
      case 'terms':
        return <Bar data={termsData} options={commonOptions} />;
      case 'languages':
        return <Pie data={languagesData} options={pieOptions} />;
      case 'engines':
        return <Pie data={enginesData} options={pieOptions} />;
      default:
        return <Line data={volumeData} options={commonOptions} />;
    }
  };

  const chartTabs = [
    { id: 'volume', label: 'Search Volume', description: 'Daily search trends' },
    { id: 'terms', label: 'Top Terms', description: 'Most searched terms' },
    { id: 'languages', label: 'Languages', description: 'Language distribution' },
    { id: 'engines', label: 'Engines', description: 'Google vs Baidu' },
  ];

  return (
    <div className="h-64">
      {/* Chart Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {chartTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveChart(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeChart === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={tab.description}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="h-48">{renderChart()}</div>
    </div>
  );
};

export default SearchAnalytics;
