import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import './GeographicHeatmap.css';

// Using a GeoJSON with proper ISO codes
const geoUrl =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

// ISO 3-letter to 2-letter code mapping
const iso3to2 = {
  USA: 'US',
  GBR: 'GB',
  FRA: 'FR',
  DEU: 'DE',
  CAN: 'CA',
  AUS: 'AU',
  JPN: 'JP',
  CHN: 'CN',
  IND: 'IN',
  BRA: 'BR',
  MEX: 'MX',
  ESP: 'ES',
  ITA: 'IT',
  NLD: 'NL',
  BEL: 'BE',
  CHE: 'CH',
  SWE: 'SE',
  NOR: 'NO',
  DNK: 'DK',
  FIN: 'FI',
  AUT: 'AT',
  POL: 'PL',
  GRC: 'GR',
  PRT: 'PT',
  IRL: 'IE',
  CZE: 'CZ',
  HUN: 'HU',
  RUS: 'RU',
  KOR: 'KR',
  SGP: 'SG',
  HKG: 'HK',
  ARE: 'AE',
  ISR: 'IL',
  EGY: 'EG',
  ZAF: 'ZA',
  ARG: 'AR',
  TUR: 'TR',
  UKR: 'UA',
  ROU: 'RO',
  BGR: 'BG',
  HRV: 'HR',
  SRB: 'RS',
  SVK: 'SK',
  SVN: 'SI',
  LTU: 'LT',
  LVA: 'LV',
  EST: 'EE',
  ISL: 'IS',
  LUX: 'LU',
  MLT: 'MT',
  CYP: 'CY',
  NZL: 'NZ',
  CHL: 'CL',
  COL: 'CO',
  PER: 'PE',
  VEN: 'VE',
  SAU: 'SA',
  TWN: 'TW',
  THA: 'TH',
  MYS: 'MY',
  IDN: 'ID',
  PHL: 'PH',
  VNM: 'VN',
};

// Country name to ISO code mapping
const countryNameToISO = {
  'United States': 'US',
  'United States of America': 'US',
  Canada: 'CA',
  'United Kingdom': 'GB',
  France: 'FR',
  Germany: 'DE',
  Italy: 'IT',
  Spain: 'ES',
  Netherlands: 'NL',
  Belgium: 'BE',
  Switzerland: 'CH',
  Austria: 'AT',
  Sweden: 'SE',
  Norway: 'NO',
  Denmark: 'DK',
  Finland: 'FI',
  Poland: 'PL',
  'Czech Republic': 'CZ',
  Czechia: 'CZ',
  Hungary: 'HU',
  Greece: 'GR',
  Portugal: 'PT',
  Ireland: 'IE',
  Russia: 'RU',
  China: 'CN',
  Japan: 'JP',
  'South Korea': 'KR',
  India: 'IN',
  Australia: 'AU',
  'New Zealand': 'NZ',
  Brazil: 'BR',
  Mexico: 'MX',
  Argentina: 'AR',
  Chile: 'CL',
  Colombia: 'CO',
  Peru: 'PE',
  Venezuela: 'VE',
  'South Africa': 'ZA',
  Egypt: 'EG',
  Israel: 'IL',
  'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE',
  Singapore: 'SG',
  'Hong Kong': 'HK',
  Taiwan: 'TW',
  Thailand: 'TH',
  Malaysia: 'MY',
  Indonesia: 'ID',
  Philippines: 'PH',
  Vietnam: 'VN',
  Turkey: 'TR',
  Ukraine: 'UA',
  Romania: 'RO',
  Bulgaria: 'BG',
  Croatia: 'HR',
  Serbia: 'RS',
  Slovakia: 'SK',
  Slovenia: 'SI',
  Lithuania: 'LT',
  Latvia: 'LV',
  Estonia: 'EE',
  Iceland: 'IS',
  Luxembourg: 'LU',
  Malta: 'MT',
  Cyprus: 'CY',
};

const GeographicHeatmap = ({ onUSClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');

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

  // Create a map of country codes to search data
  const dataMap = data.reduce((acc, item) => {
    if (item.country_code) {
      acc[item.country_code] = item;
    }
    return acc;
  }, {});

  // Calculate color scale with better visibility for smaller values
  const maxSearches = Math.max(...data.map(d => parseInt(d.search_count) || 0), 1);
  const colorScale = scaleLinear()
    .domain([0, Math.sqrt(maxSearches)]) // Use square root scale for better distribution
    .range(['#BBDEFB', '#0D47A1']); // More contrast: light blue to dark blue

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

  return (
    <div className="w-full h-96 relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1.2}>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                // Get country name and ISO code from properties
                const countryName = geo.properties.name || geo.properties.NAME || '';
                const isoCode = geo.properties.ISO_A2 || geo.id;

                // Try multiple ways to get the country code
                const code2 =
                  iso3to2[isoCode] || // Convert 3-letter to 2-letter
                  isoCode || // Use as-is if it's already 2-letter
                  countryNameToISO[countryName] ||
                  countryNameToISO[countryName.replace(/^The /, '')];

                const countryData = dataMap[code2];
                const hasData = !!countryData;
                const searchCount = hasData ? parseInt(countryData.search_count) : 0;

                // Use the location name from data if available, otherwise fallback to geography name
                const displayName =
                  hasData && countryData.location ? countryData.location : countryName;

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
                        const tooltipText = `${displayName}: ${
                          countryData.search_count
                        } searches (${countryData.percentage}%)`;
                        setTooltipContent(
                          code2 === 'US' && onUSClick
                            ? `${tooltipText} (Click to view states)`
                            : tooltipText
                        );
                      } else {
                        setTooltipContent(`${displayName}: No data`);
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    onClick={() => {
                      if (code2 === 'US' && onUSClick) {
                        onUSClick();
                      }
                    }}
                    data-tooltip-id="map-tooltip"
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
        <div className="text-xs font-semibold mb-2">Search Activity</div>
        <div className="flex items-center gap-2">
          <div className="text-xs">Low</div>
          <div className="w-20 h-3 bg-gradient-to-r from-blue-50 to-blue-700 rounded" />
          <div className="text-xs">High</div>
        </div>
      </div>

      <Tooltip
        id="map-tooltip"
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

export default GeographicHeatmap;
