import React, { useState } from 'react';
import axios from 'axios';

const SearchDemo = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    serpapi: [],
    serper: [],
    loading: false,
    error: null,
  });

  const handleSearch = async e => {
    e.preventDefault();
    if (!query.trim()) return;

    setResults(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Call our demo endpoint that will fetch from both providers
      const response = await axios.post('/api/search-demo', {
        query: query.trim(),
      });

      setResults({
        serpapi: response.data.serpapi || [],
        serper: response.data.serper || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Search demo error:', error);
      setResults(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch search results',
      }));
    }
  };

  const ImageResult = ({ image, index }) => (
    <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
      <div className="text-xs text-gray-500 mb-2">#{index + 1}</div>
      <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
        <img
          src={image.url}
          alt={image.title || `Result ${index + 1}`}
          className="w-full h-full object-cover"
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
          style={{ display: 'none' }}
        >
          Image failed to load
        </div>
      </div>
      <div className="text-sm">
        <div className="font-medium text-gray-900 truncate mb-1">{image.title || 'No title'}</div>
        <div className="text-gray-500 text-xs truncate mb-1">
          {image.source || 'Unknown source'}
        </div>
        <div className="text-gray-400 text-xs break-all">{image.url}</div>
      </div>
    </div>
  );

  const ProviderSection = ({ title, results, provider, bgColor, textColor }) => (
    <div className="flex-1">
      <div className={`${bgColor} ${textColor} p-4 rounded-t-lg`}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm opacity-90">
          {results.length} results • {provider === 'serpapi' ? '$150/month' : '$3/month'}
        </div>
      </div>
      <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-gray-50">
        {results.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No results to display</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.slice(0, 5).map((image, index) => (
              <ImageResult key={index} image={image} index={index} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Provider Comparison</h1>
          <p className="text-gray-600 mb-4">
            Compare image search results between SerpAPI ($150/month) and Serper.dev ($3/month)
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter search query (e.g., 'cats', 'sunset', 'cars')"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                disabled={results.loading}
              />
              <button
                type="submit"
                disabled={results.loading || !query.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {results.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>

          {results.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <strong>Error:</strong> {results.error}
            </div>
          )}
        </div>

        {/* Results Comparison */}
        {(results.serpapi.length > 0 || results.serper.length > 0) && (
          <div className="flex gap-6 mt-8">
            <ProviderSection
              title="SerpAPI Results"
              results={results.serpapi}
              provider="serpapi"
              bgColor="bg-blue-600"
              textColor="text-white"
            />

            <ProviderSection
              title="Serper.dev Results"
              results={results.serper}
              provider="serper"
              bgColor="bg-green-600"
              textColor="text-white"
            />
          </div>
        )}

        {/* Performance Stats */}
        {results.serpapi.length > 0 || results.serper.length > 0 ? (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.serpapi.length}</div>
                <div className="text-sm text-gray-600">SerpAPI Results</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.serper.length}</div>
                <div className="text-sm text-gray-600">Serper Results</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">$150</div>
                <div className="text-sm text-gray-600">SerpAPI Monthly Cost</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">$3</div>
                <div className="text-sm text-gray-600">Serper Monthly Cost</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold text-green-600">
                98% Cost Savings: $147/month saved with Serper.dev!
              </div>
            </div>
          </div>
        ) : null}

        {/* Instructions */}
        {results.serpapi.length === 0 && results.serper.length === 0 && !results.loading && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Enter a search query in the input field above</li>
              <li>Click "Search" to fetch results from both providers</li>
              <li>Compare the image quality, relevance, and sources</li>
              <li>Notice the massive cost difference: $150/month vs $3/month</li>
              <li>See that Serper.dev provides comparable or better results</li>
            </ol>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                <strong>Note:</strong> This demo fetches live results from both APIs to demonstrate
                the quality and performance differences in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDemo;
