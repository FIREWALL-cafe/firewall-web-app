import React, { useEffect, useState } from 'react';

const RecentActivity = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/recent-activity');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = timestamp => {
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const getLanguageFlag = langCode => {
    const flags = {
      en: '🇺🇸',
      'zh-CN': '🇨🇳',
      zh: '🇨🇳',
      es: '🇪🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
      ja: '🇯🇵',
      ko: '🇰🇷',
      ru: '🇷🇺',
      ar: '🇸🇦',
      pt: '🇵🇹',
      it: '🇮🇹',
      nl: '🇳🇱',
      sv: '🇸🇪',
      no: '🇳🇴',
      da: '🇩🇰',
      fi: '🇫🇮',
      pl: '🇵🇱',
      ceb: '🇵🇭',
    };
    return flags[langCode] || '🌐';
  };

  const getEngineIcon = engine => {
    if (engine === 'google') return '🔍';
    if (engine === 'baidu') return '🟡';
    return '🔍';
  };

  const formatIpAddress = ip => {
    if (!ip) return 'Unknown IP';

    // Truncate long IPv6 addresses for display
    if (ip.length > 15) {
      return ip.substring(0, 12) + '...';
    }

    return ip;
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
          <p>Error loading recent activity</p>
          <button
            onClick={fetchRecentActivity}
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
      <div className="h-64 flex items-center justify-center text-gray-500">
        No recent activity available
      </div>
    );
  }

  const hasAnyIPData = data.some(
    search => search.search_ip_address && search.search_ip_address !== 'null'
  );

  return (
    <div className="h-64 overflow-y-auto">
      {!hasAnyIPData && data.length > 0 && (
        <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          ⚠️ IP tracking not available for displayed searches. Check backend API configuration.
        </div>
      )}
      <div className="space-y-2">
        {data.map((search, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {search.search_term_initial}
                </span>
                {search.search_term_translation &&
                  search.search_term_translation !== search.search_term_initial && (
                    <span className="text-xs text-gray-500">
                      → {search.search_term_translation}
                    </span>
                  )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full" />
                  {search.search_client_name || 'Anonymous'}
                </span>
                <span className="flex items-center gap-1">📍 {search.search_location}</span>
                <span className="flex items-center gap-1">
                  {getLanguageFlag(search.search_term_initial_language_code)}
                  {search.search_term_initial_language_code || 'unknown'}
                </span>
                <span className="flex items-center gap-1">
                  {getEngineIcon(search.search_engine_initial)}
                  {search.search_engine_initial}
                </span>
                {search.search_ip_address && search.search_ip_address !== 'null' && (
                  <span
                    className="flex items-center gap-1"
                    title={`IP Address: ${search.search_ip_address}`}
                  >
                    🌐 {formatIpAddress(search.search_ip_address)}
                  </span>
                )}
                {(!search.search_ip_address || search.search_ip_address === 'null') && (
                  <span
                    className="flex items-center gap-1 text-gray-400"
                    title="IP tracking not available for this search"
                  >
                    🌐 No IP tracked
                  </span>
                )}
                {parseInt(search.vote_count) > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full" />
                    {search.vote_count} votes
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 ml-3">
              <span className="text-xs text-gray-400">
                {formatTimestamp(search.search_timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchRecentActivity}
          className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
