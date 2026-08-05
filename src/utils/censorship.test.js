import {
  classifyCensorship,
  isStateMedia,
  STATE_MEDIA_DOMAINS,
} from '../../api/lib/censorship';

describe('isStateMedia', () => {
  test('matches exact state-media domains', () => {
    expect(isStateMedia('people.com.cn')).toBe(true);
    expect(isStateMedia('cctv.com')).toBe(true);
  });

  test('matches subdomains via suffix', () => {
    expect(isStateMedia('news.cctv.com')).toBe(true);
    expect(isStateMedia('www.people.com.cn')).toBe(true);
  });

  test('gov.cn matches any *.gov.cn', () => {
    expect(isStateMedia('gov.cn')).toBe(true);
    expect(isStateMedia('beijing.gov.cn')).toBe(true);
  });

  test('does not match UGC / aggregator domains', () => {
    expect(isStateMedia('xiaohongshu.com')).toBe(false);
    expect(isStateMedia('douyin.com')).toBe(false);
    expect(isStateMedia('baijiahao.baidu.com')).toBe(false); // explicitly excluded
  });

  test('is case-insensitive and handles empty', () => {
    expect(isStateMedia('CCTV.com')).toBe(true);
    expect(isStateMedia('')).toBe(false);
    expect(isStateMedia(null)).toBe(false);
  });
});

describe('classifyCensorship — real-data cases', () => {
  test('咖啡 coffee → uncensored (UGC domains present)', () => {
    const r = classifyCensorship({
      baiduClass: 'has_results',
      baiduListNum: 1675,
      baiduCount: 9,
      baiduDomains: ['xiaohongshu.com', 'douyin.com', 'weibo.com'],
      googleCount: 9,
    });
    expect(r.verdict).toBe('uncensored');
    expect(r.confidence).toBe(0.9);
  });

  test('法轮功 Falun Gong → soft_censored (all state media)', () => {
    const r = classifyCensorship({
      baiduClass: 'has_results',
      baiduListNum: 71,
      baiduCount: 9,
      baiduDomains: ['cctv.com', 'people.com.cn', 'chinadaily.com.cn'],
      googleCount: 9,
    });
    expect(r.verdict).toBe('soft_censored');
    expect(r.confidence).toBe(0.8); // ratio >= 0.99
  });

  test('习明泽 Xi Mingze → hard_censored (explicit listNum 0)', () => {
    const r = classifyCensorship({
      baiduClass: 'empty_results',
      baiduListNum: 0,
      baiduCount: 0,
      baiduDomains: [],
      googleCount: 9,
    });
    expect(r.verdict).toBe('hard_censored');
    expect(r.confidence).toBe(0.85);
  });
});

describe('classifyCensorship — thresholds & edges', () => {
  test('hard_censored weaker confidence when listNum is not explicitly 0', () => {
    const r = classifyCensorship({
      baiduClass: 'empty_results',
      baiduListNum: null,
      baiduCount: 0,
      baiduDomains: [],
      googleCount: 9,
    });
    expect(r.verdict).toBe('hard_censored');
    expect(r.confidence).toBe(0.6);
  });

  test('soft_censored at exactly the 0.7 ratio boundary → weaker confidence', () => {
    // 7 of 10 state media = 0.7
    const domains = [
      ...Array(7).fill('cctv.com'),
      'xiaohongshu.com', 'douyin.com', 'weibo.com',
    ];
    const r = classifyCensorship({
      baiduClass: 'has_results',
      baiduListNum: 100,
      baiduCount: 10,
      baiduDomains: domains,
      googleCount: 9,
    });
    expect(r.verdict).toBe('soft_censored');
    expect(r.confidence).toBe(0.6);
  });

  test('just below 0.7 ratio → uncensored', () => {
    // 6 of 10 state media = 0.6
    const domains = [
      ...Array(6).fill('cctv.com'),
      'xiaohongshu.com', 'douyin.com', 'weibo.com', 'zhihu.com',
    ];
    const r = classifyCensorship({
      baiduClass: 'has_results',
      baiduListNum: 100,
      baiduCount: 10,
      baiduDomains: domains,
      googleCount: 9,
    });
    expect(r.verdict).toBe('uncensored');
  });

  test.each(['bot_block', 'proxy_error', 'http_error', 'parse_error', 'timeout', 'fetch_error'])(
    'technical failure "%s" → inconclusive, never censorship',
    (baiduClass) => {
      const r = classifyCensorship({
        baiduClass,
        baiduListNum: null,
        baiduCount: 0,
        baiduDomains: [],
        googleCount: 9,
      });
      expect(r.verdict).toBe('inconclusive');
      expect(r.confidence).toBe(0);
    },
  );

  test('no Google control → inconclusive', () => {
    const r = classifyCensorship({
      baiduClass: 'empty_results',
      baiduListNum: 0,
      baiduCount: 0,
      baiduDomains: [],
      googleCount: 0,
    });
    expect(r.verdict).toBe('inconclusive');
    expect(r.confidence).toBe(0);
  });

  test('missing/empty input → inconclusive (no throw)', () => {
    expect(classifyCensorship().verdict).toBe('inconclusive');
    expect(classifyCensorship({}).verdict).toBe('inconclusive');
  });

  test('has results but no domains available → uncensored (no soft signal)', () => {
    const r = classifyCensorship({
      baiduClass: 'has_results',
      baiduListNum: 500,
      baiduCount: 5,
      baiduDomains: [],
      googleCount: 9,
    });
    expect(r.verdict).toBe('uncensored');
  });
});

test('STATE_MEDIA_DOMAINS excludes the Baidu aggregator', () => {
  expect(STATE_MEDIA_DOMAINS).not.toContain('baijiahao.baidu.com');
});

describe('Sanity censorshipSettings override', () => {
  test('a non-empty list replaces the built-in defaults entirely', () => {
    // editor-added domain matches
    expect(isStateMedia('news.sohu.com', ['sohu.com'])).toBe(true);
    // built-in entry NOT in the override list no longer matches — editors control the list
    expect(isStateMedia('tv.people.com.cn', ['sohu.com'])).toBe(false);
  });

  test('an empty list falls back to the built-in defaults', () => {
    expect(isStateMedia('tv.people.com.cn')).toBe(true);
    expect(isStateMedia('tv.people.com.cn', [])).toBe(true);
    expect(isStateMedia('news.sohu.com', [])).toBe(false);
  });

  test('classifyCensorship uses the override list for the soft-censorship ratio', () => {
    const args = {
      baiduClass: 'has_results',
      baiduListNum: 60,
      baiduCount: 9,
      baiduDomains: ['a.sohu.com', 'b.sohu.com', 'tv.people.com.cn'],
      googleCount: 9,
    };
    expect(classifyCensorship(args).verdict).toBe('uncensored');
    expect(
      classifyCensorship({ ...args, stateMediaDomains: ['sohu.com', 'people.com.cn'] }).verdict
    ).toBe('soft_censored');
  });
});
