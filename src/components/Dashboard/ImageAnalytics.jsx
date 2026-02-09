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

const ImageAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('engineSplit');

  useEffect(() => {
    fetchImageAnalytics();
  }, []);

  const fetchImageAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/image-analytics');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching image analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-500">
        <div className="text-center">
          <p>Error loading image analytics</p>
          <button
            onClick={fetchImageAnalytics}
            className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
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
        No image analytics data available
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

  // Engine Split Pie Chart
  const engineSplitData = {
    labels: data.engineSplit.map(item =>
      item.engine === 'google' ? 'Google' : item.engine === 'baidu' ? 'Baidu' : item.engine
    ),
    datasets: [
      {
        data: data.engineSplit.map(item => parseInt(item.image_count)),
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
            return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Image Volume Line Chart
  const volumeData = {
    labels: data.imageVolume
      .map(item =>
        new Date(item.image_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
      .reverse(),
    datasets: [
      {
        label: 'Daily Images',
        data: data.imageVolume.map(item => parseInt(item.image_count)).reverse(),
        borderColor: 'rgba(13, 148, 136, 1)',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Censorship Gap Grouped Bar Chart
  const buildCensorshipGapData = () => {
    const engines = [...new Set(data.censorshipGap.map(item => item.engine))];
    const labels = engines.map(e => (e === 'google' ? 'Google' : e === 'baidu' ? 'Baidu' : e));

    const censoredValues = engines.map(engine => {
      const row = data.censorshipGap.find(
        item => item.engine === engine && item.vote_type === 'censored'
      );
      return row ? parseFloat(row.avg_images) : 0;
    });

    const uncensoredValues = engines.map(engine => {
      const row = data.censorshipGap.find(
        item => item.engine === engine && item.vote_type === 'uncensored'
      );
      return row ? parseFloat(row.avg_images) : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Censored',
          data: censoredValues,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Uncensored',
          data: uncensoredValues,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const gapBarOptions = {
    ...commonOptions,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Avg Images / Search',
          font: { size: 10 },
        },
      },
    },
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'engineSplit':
        return <Pie data={engineSplitData} options={pieOptions} />;
      case 'volume':
        return <Line data={volumeData} options={commonOptions} />;
      case 'censorshipGap':
        return data.censorshipGap.length > 0 ? (
          <Bar data={buildCensorshipGapData()} options={gapBarOptions} />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500">
            No censorship gap data available
          </div>
        );
      default:
        return <Pie data={engineSplitData} options={pieOptions} />;
    }
  };

  const chartTabs = [
    { id: 'engineSplit', label: 'Engine Split', description: 'Google vs Baidu images' },
    { id: 'volume', label: 'Volume', description: 'Daily image trends' },
    { id: 'censorshipGap', label: 'Censorship Gap', description: 'Avg images by censorship vote' },
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
                ? 'bg-teal-600 text-white'
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

export default ImageAnalytics;
