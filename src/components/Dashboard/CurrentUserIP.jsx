import React, { useEffect, useState } from 'react';

const CurrentUserIP = () => {
  const [userIP, setUserIP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserIP();
  }, []);

  const fetchUserIP = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/my-ip');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setUserIP(result.ip);
    } catch (err) {
      console.error('Error fetching user IP:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (userIP) {
      navigator.clipboard
        .writeText(userIP)
        .then(() => {
          // Could add a toast notification here
        })
        .catch(err => {
          console.error('Failed to copy IP:', err);
        });
    }
  };

  const getIPType = ip => {
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

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Your IP Address</h3>
            <div className="animate-pulse">
              <div className="h-6 bg-blue-200 rounded mt-1 w-32" />
            </div>
          </div>
          <div className="text-blue-600 text-2xl">🌐</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-red-900">Your IP Address</h3>
            <p className="text-sm text-red-600 mt-1">Unable to detect</p>
            <button
              onClick={fetchUserIP}
              className="text-xs text-red-500 hover:text-red-700 underline mt-1"
            >
              Retry
            </button>
          </div>
          <div className="text-red-600 text-2xl">❌</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-green-900">Your IP Address</h3>
          <div className="flex items-center gap-2 mt-1">
            <code
              className="text-lg font-mono text-green-800 cursor-pointer hover:bg-green-100 px-2 py-1 rounded"
              onClick={copyToClipboard}
              title="Click to copy to clipboard"
            >
              {userIP}
            </code>
            <button
              onClick={copyToClipboard}
              className="text-green-600 hover:text-green-800 text-sm"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          <p className="text-xs text-green-600 mt-1">Type: {getIPType(userIP)}</p>
        </div>
        <div className="text-green-600 text-2xl">✅</div>
      </div>
    </div>
  );
};

export default CurrentUserIP;
