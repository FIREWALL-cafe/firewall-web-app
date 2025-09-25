import React, { useEffect, useState } from 'react';

const IPGeographicDistribution = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIPDistribution();
  }, []);

  const fetchIPDistribution = async () => {
    try {
      setLoading(true);
      // Use recent activity data since it includes IP addresses
      const response = await fetch('/api/analytics/recent-activity');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching IP distribution:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIPTypeColor = type => {
    const colors = {
      'IPv4 Public': 'bg-blue-500',
      'IPv6 Public': 'bg-purple-500',
      'Private/Internal': 'bg-yellow-500',
      Localhost: 'bg-gray-500',
      Unknown: 'bg-red-500',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getIPTypeIcon = type => {
    const icons = {
      'IPv4 Public': '🌐',
      'IPv6 Public': '🌍',
      'Private/Internal': '🏠',
      Localhost: '💻',
      Unknown: '❓',
    };
    return icons[type] || '🔍';
  };

  const categorizeIP = ip => {
    if (!ip) return 'Unknown';

    // Check for localhost
    if (ip === '127.0.0.1' || ip === '::1') {
      return 'Localhost';
    }

    // Check for private/internal IPs
    if (ip.startsWith('10.') || ip.startsWith('172.') || ip.startsWith('192.168.')) {
      return 'Private/Internal';
    }

    // Check for IPv6
    if (ip.includes(':')) {
      return 'IPv6 Public';
    }

    return 'IPv4 Public';
  };

  const processDistributionData = rawData => {
    const ipCounts = {};
    const typeCounts = {};

    rawData.forEach(item => {
      const ip = item.search_ip_address;
      if (ip) {
        // Count unique IPs
        ipCounts[ip] = (ipCounts[ip] || 0) + 1;

        // Count by IP type
        const type = categorizeIP(ip);
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const ipDistribution = Object.entries(ipCounts)
      .map(([ip, count]) => ({
        ip,
        count,
        type: categorizeIP(ip),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 IPs

    const typeDistribution = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return { ipDistribution, typeDistribution };
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center text-red-500">
        <div className="text-center">
          <p>Error loading IP distribution</p>
          <button
            onClick={fetchIPDistribution}
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
      <div className="h-80 flex items-center justify-center text-gray-500">
        No IP data available
      </div>
    );
  }

  const { ipDistribution, typeDistribution } = processDistributionData(data);
  const totalRequests = data.length;

  return (
    <div className="h-80 overflow-y-auto">
      <div className="space-y-6">
        {/* IP Type Distribution */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">IP Type Distribution</h4>
          <div className="space-y-2">
            {typeDistribution.map((item, index) => {
              const percentage = Math.round((item.count / totalRequests) * 100);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getIPTypeIcon(item.type)}</span>
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${getIPTypeColor(item.type)}`} />
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top IP Addresses */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Top IP Addresses</h4>
          <div className="space-y-2">
            {ipDistribution.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg">{getIPTypeIcon(item.type)}</span>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono text-gray-800 truncate block">
                      {item.ip}
                    </code>
                    <span className="text-xs text-gray-500">{item.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{item.count}</span>
                  <span className="text-xs text-gray-500">requests</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-800">{totalRequests}</div>
              <div className="text-xs text-blue-600">Total Requests</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-800">
                {Object.keys(ipDistribution).length}
              </div>
              <div className="text-xs text-blue-600">Unique IPs</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-800">{typeDistribution.length}</div>
              <div className="text-xs text-blue-600">IP Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchIPDistribution}
          className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default IPGeographicDistribution;
