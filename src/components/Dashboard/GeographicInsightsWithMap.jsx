import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import GeographicHeatmap from './GeographicHeatmap';
import USStatesHeatmap from './USStatesHeatmap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GeographicInsightsWithMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'map'
  const [mapViewMode, setMapViewMode] = useState('world'); // 'world' or 'us-states'

  useEffect(() => {
    fetchGeographicData();
  }, []);

  const fetchGeographicData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/geographic');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching geographic data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get country flag emoji
  const getCountryFlag = countryCode => {
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center text-red-500">
        <div className="text-center">
          <p>Error loading geographic data</p>
          <button
            onClick={fetchGeographicData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No geographic data available
      </div>
    );
  }

  const chartData = {
    labels: data.map(item =>
      item.country_code ? `${getCountryFlag(item.country_code)} ${item.location}` : item.location
    ),
    datasets: [
      {
        label: 'Searches',
        data: data.map(item => parseInt(item.search_count)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataPoint = data[context.dataIndex];
            return `${dataPoint.search_count} searches (${dataPoint.percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const handleUSClick = () => {
    setMapViewMode('us-states');
  };

  const handleBackToWorld = () => {
    setMapViewMode('world');
  };

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {viewMode === 'map' && mapViewMode === 'us-states'
            ? 'US States Distribution'
            : 'Geographic Distribution'}
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'chart'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={viewMode === 'chart' ? 'h-64' : 'h-96'}>
        {viewMode === 'chart' ? (
          <Bar data={chartData} options={chartOptions} />
        ) : mapViewMode === 'us-states' ? (
          <USStatesHeatmap onBackClick={handleBackToWorld} />
        ) : (
          <GeographicHeatmap onUSClick={handleUSClick} />
        )}
      </div>
    </div>
  );
};

export default GeographicInsightsWithMap;
