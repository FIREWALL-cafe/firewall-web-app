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
import { Bar, Pie, Line } from 'react-chartjs-2';

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

const VoteAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('categories');

  useEffect(() => {
    fetchVoteAnalytics();
  }, []);

  const fetchVoteAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/vote-analytics');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching vote analytics:', err);
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
          <p>Error loading vote analytics</p>
          <button
            onClick={fetchVoteAnalytics}
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
        No vote analytics data available
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

  // Vote Categories Bar Chart
  const categoriesData = {
    labels: data.voteCategories.map(cat => cat.name),
    datasets: [
      {
        label: 'Vote Count',
        data: data.voteCategories.map(cat => cat.count),
        backgroundColor: data.voteCategories.map(cat => cat.color + 'CC'), // Add transparency
        borderColor: data.voteCategories.map(cat => cat.color),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Vote Categories Pie Chart
  const categoriesPieData = {
    labels: data.voteCategories.filter(cat => cat.count > 0).map(cat => cat.name),
    datasets: [
      {
        data: data.voteCategories.filter(cat => cat.count > 0).map(cat => cat.count),
        backgroundColor: data.voteCategories
          .filter(cat => cat.count > 0)
          .map(cat => cat.color + 'CC'),
        borderColor: data.voteCategories.filter(cat => cat.count > 0).map(cat => cat.color),
        borderWidth: 2,
      },
    ],
  };

  // Vote Timeline Line Chart
  const timelineData = {
    labels: data.voteTimeline
      .map(item =>
        new Date(item.vote_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
      .reverse(),
    datasets: [
      {
        label: 'Daily Votes',
        data: data.voteTimeline.map(item => parseInt(item.vote_count)).reverse(),
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieOptions = {
    ...commonOptions,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const percentage = ((context.raw / data.totalVotes) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'categories':
        return <Bar data={categoriesData} options={commonOptions} />;
      case 'distribution':
        return data.totalVotes > 0 ? (
          <Pie data={categoriesPieData} options={pieOptions} />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500">
            No vote data available
          </div>
        );
      case 'timeline':
        return data.voteTimeline.length > 0 ? (
          <Line data={timelineData} options={commonOptions} />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500">
            No timeline data available
          </div>
        );
      case 'controversial':
        return (
          <div className="h-48 overflow-y-auto">
            <div className="space-y-2">
              {data.topVotedSearches.length > 0 ? (
                data.topVotedSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {search.search_term_initial}
                      </p>
                      <p className="text-xs text-gray-500">{search.search_location}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        {search.total_votes} votes
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  No controversial searches available
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <Bar data={categoriesData} options={commonOptions} />;
    }
  };

  const chartTabs = [
    { id: 'categories', label: 'Categories', description: 'Vote category breakdown' },
    { id: 'distribution', label: 'Distribution', description: 'Vote percentage distribution' },
    { id: 'timeline', label: 'Timeline', description: 'Vote trends over time' },
    { id: 'controversial', label: 'Top Voted', description: 'Most controversial searches' },
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
                ? 'bg-purple-600 text-white'
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

      {/* Summary Stats */}
      {data.totalVotes > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Total votes: {data.totalVotes} | Most common:{' '}
          {
            data.voteCategories.reduce((prev, current) =>
              prev.count > current.count ? prev : current
            ).name
          }{' '}
          (
          {
            data.voteCategories.reduce((prev, current) =>
              prev.count > current.count ? prev : current
            ).count
          }
          )
        </div>
      )}
    </div>
  );
};

export default VoteAnalytics;
