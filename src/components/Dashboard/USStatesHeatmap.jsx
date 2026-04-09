import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import './GeographicHeatmap.css';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const USStatesHeatmap = ({ onBackClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');

  useEffect(() => {
    fetchUSStatesData();
  }, []);

  const fetchUSStatesData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/us-states');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching US states data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a map of state names to search data
  const dataMap = data.reduce((acc, item) => {
    if (item.state) {
      acc[item.state] = item;
    }
    return acc;
  }, {});

  // Calculate color scale
  const maxSearches = Math.max(...data.map(d => parseInt(d.search_count) || 0), 1);
  const colorScale = scaleLinear()
    .domain([0, Math.sqrt(maxSearches)])
    .range(['#BBDEFB', '#0D47A1']);

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
          <p>Error loading US states data</p>
          <button
            onClick={fetchUSStatesData}
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
        <div className="text-center">
          <p>No US states data available</p>
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ← Back to World View
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 relative">
      {/* Back Button */}
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="absolute top-4 left-4 z-10 px-3 py-1 bg-white rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700"
        >
          ← Back to World
        </button>
      )}

      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 800,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const stateName = geo.properties.name;
                const stateData = dataMap[stateName];
                const hasData = !!stateData;
                const searchCount = hasData ? parseInt(stateData.search_count) : 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hasData ? colorScale(Math.sqrt(searchCount)) : '#F5F5F5'}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none',
                      },
                      hover: {
                        fill: hasData ? '#FF6B6B' : '#E0E0E0',
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: hasData ? '#E53E3E' : '#BDBDBD',
                        outline: 'none',
                      },
                    }}
                    onMouseEnter={() => {
                      if (hasData) {
                        setTooltipContent(
                          `${stateName}: ${stateData.search_count} searches (${
                            stateData.percentage
                          }%)`
                        );
                      } else {
                        setTooltipContent(`${stateName}: No data`);
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    data-tooltip-id="states-tooltip"
                    data-tooltip-content={tooltipContent}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Color Scale Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="text-xs font-semibold mb-2">US Search Activity</div>
        <div className="flex items-center gap-2">
          <div className="text-xs">Low</div>
          <div className="w-20 h-3 bg-gradient-to-r from-blue-50 to-blue-700 rounded" />
          <div className="text-xs">High</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {data.length} state{data.length !== 1 ? 's' : ''} with data
        </div>
      </div>

      <Tooltip
        id="states-tooltip"
        className="map-tooltip"
        border="1px solid #e60011"
        style={{
          backgroundColor: 'white',
          color: '#333',
          borderRadius: '6px',
        }}
      />
    </div>
  );
};

export default USStatesHeatmap;
