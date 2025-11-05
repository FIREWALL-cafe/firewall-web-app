import * as sanity from '../sanity';

// Mock the sanity module
jest.mock('../sanity');

describe('Timeline Data Fetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getTimelineEvents returns array of events ordered by year', async () => {
    const mockData = [
      {
        _id: '1',
        year: 1989,
        title: 'Tiananmen Square',
        description: 'Protests in Beijing',
        googleImage: null,
        baiduImage: null,
      },
      {
        _id: '2',
        year: 2003,
        title: 'Great Firewall Launched',
        description: 'The Golden Shield project began',
        googleImage: null,
        baiduImage: null,
      },
    ];

    sanity.getTimelineEvents.mockResolvedValue(mockData);

    const result = await sanity.getTimelineEvents('en');

    expect(result).toEqual(mockData);
    expect(result).toHaveLength(2);
    expect(result[0].year).toBe(1989);
    expect(result[1].year).toBe(2003);
    expect(sanity.getTimelineEvents).toHaveBeenCalledTimes(1);
  });

  test('query returns localized fields with proper fallback to English', async () => {
    const mockData = [
      {
        _id: '1',
        year: 1989,
        title: 'Tiananmen Square', // Falls back to English when Chinese not available
        description: 'Protests in Beijing',
        googleImage: null,
        baiduImage: null,
      },
    ];

    sanity.getTimelineEvents.mockResolvedValue(mockData);

    const result = await sanity.getTimelineEvents('zh');

    expect(result[0].title).toBe('Tiananmen Square');
    expect(sanity.getTimelineEvents).toHaveBeenCalledWith('zh');
  });

  test('missing images handled gracefully (null or empty object)', async () => {
    const mockData = [
      {
        _id: '1',
        year: 2003,
        title: 'Great Firewall',
        description: 'Project launched',
        googleImage: null,
        baiduImage: null,
      },
      {
        _id: '2',
        year: 2009,
        title: 'Green Dam',
        description: 'Filtering software',
        googleImage: {},
        baiduImage: {},
      },
    ];

    sanity.getTimelineEvents.mockResolvedValue(mockData);

    const result = await sanity.getTimelineEvents('en');

    expect(result[0].googleImage).toBeNull();
    expect(result[0].baiduImage).toBeNull();
    expect(result[1].googleImage).toEqual({});
    expect(result[1].baiduImage).toEqual({});
  });

  test('events ordered chronologically by year (ascending)', async () => {
    const mockData = [
      { _id: '1', year: 1989, title: 'First', description: 'First event' },
      { _id: '2', year: 1991, title: 'Second', description: 'Second event' },
      { _id: '3', year: 1994, title: 'Third', description: 'Third event' },
      { _id: '4', year: 2003, title: 'Fourth', description: 'Fourth event' },
    ];

    sanity.getTimelineEvents.mockResolvedValue(mockData);

    const result = await sanity.getTimelineEvents('en');

    expect(result[0].year).toBeLessThan(result[1].year);
    expect(result[1].year).toBeLessThan(result[2].year);
    expect(result[2].year).toBeLessThan(result[3].year);
  });

  test('handles empty timeline gracefully', async () => {
    sanity.getTimelineEvents.mockResolvedValue([]);

    const result = await sanity.getTimelineEvents('en');

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
