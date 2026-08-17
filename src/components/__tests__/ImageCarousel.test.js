import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as sanity from '../../lib/sanity';
import { __resetStateMediaDomainsCache } from '../../hooks/useStateMediaDomains';
import ImageCarousel from '../ImageCarousel';

jest.mock('../../lib/sanity', () => ({
  getCensorshipSettings: jest.fn().mockResolvedValue({}),
}));

beforeEach(() => {
  __resetStateMediaDomainsCache();
  sanity.getCensorshipSettings.mockResolvedValue({});
});

const images = {
  googleResults: [
    { image: 'g1.jpg', source: 'https://example.com/page1' },
    { image: 'g2.jpg', source: null },
  ],
  baiduResults: [{ image: 'b1.jpg', source: 'https://tv.people.com.cn/article' }],
};

describe('ImageCarousel result links', () => {
  test('thumbnails are select buttons, not links', () => {
    render(<ImageCarousel images={images} />);
    const googleThumbs = screen.getAllByRole('button', { name: /Select Google result/ });
    expect(googleThumbs).toHaveLength(2);
    googleThumbs.forEach(thumb => expect(thumb).not.toHaveAttribute('href'));
  });

  test('clicking a thumbnail selects it into the feature slot without navigating', () => {
    render(<ImageCarousel images={images} />);
    expect(screen.queryByAltText('Google search result 1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Select Google result 1' }));
    expect(screen.getByAltText('Google search result 1')).toBeInTheDocument();
    expect(screen.getByAltText('Baidu search result 1')).toBeInTheDocument();
  });

  test('feature image is not wrapped in a link; the source badge is the only link', () => {
    render(<ImageCarousel images={images} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select Google result 1' }));
    expect(screen.getByAltText('Google search result 1').closest('a')).toBeNull();
    const badges = screen.getAllByTitle(/Open original page/);
    badges.forEach(badge => {
      expect(badge).toHaveAttribute('target', '_blank');
      expect(badge.getAttribute('rel')).toContain('noopener');
    });
    // thumbnail badge + feature badge for the two sourced results
    expect(badges.some(b => b.getAttribute('href') === 'https://example.com/page1')).toBe(true);
    expect(
      badges.some(b => b.getAttribute('href') === 'https://tv.people.com.cn/article')
    ).toBe(true);
  });

  test('Baidu results from state-media domains get the soft-censorship triangle', () => {
    render(<ImageCarousel images={images} />);
    // Baidu thumbnail sourced from tv.people.com.cn → warning shown
    expect(screen.getAllByRole('img', { name: 'Soft censorship warning' })).toHaveLength(1);
  });

  test('non-state-media sources get no soft-censorship triangle', () => {
    render(
      <ImageCarousel
        images={{
          googleResults: [{ image: 'g1.jpg', source: 'https://tv.people.com.cn/x' }],
          baiduResults: [{ image: 'b1.jpg', source: 'https://www.douyin.com/video/1' }],
        }}
      />
    );
    // Google results never get the triangle, and douyin.com is not state media
    expect(screen.queryByRole('img', { name: 'Soft censorship warning' })).not.toBeInTheDocument();
  });

  test('the Sanity list overrides triangle matching entirely', async () => {
    sanity.getCensorshipSettings.mockResolvedValue({ stateMediaDomains: ['douyin.com'] });
    render(
      <ImageCarousel
        images={{
          googleResults: [{ image: 'g1.jpg', source: null }],
          baiduResults: [
            { image: 'b1.jpg', source: 'https://www.douyin.com/video/1' },
            { image: 'b2.jpg', source: 'https://tv.people.com.cn/article' },
          ],
        }}
      />
    );
    // douyin.com is in the editor list → triangle; the built-in people.com.cn
    // is not in the override list → no triangle for it.
    await waitFor(() =>
      expect(screen.getAllByRole('img', { name: 'Soft censorship warning' })).toHaveLength(1)
    );
  });

  test('empty Baidu results with a hard_censored verdict show censored tiles, not the error panel', () => {
    const { container } = render(
      <ImageCarousel
        images={{
          googleResults: images.googleResults,
          baiduResults: [],
          censorship: { verdict: 'hard_censored', confidence: 0.85 },
        }}
        onRetry={() => {}}
      />
    );
    expect(
      container.querySelectorAll('img[src*="censored-image-placeholder"]')
    ).toHaveLength(9);
    expect(screen.queryByText('Unable to Connect')).not.toBeInTheDocument();
    // The explanatory copy is gone; the icons and Retry carry the state.
    expect(screen.queryByText('Possibly Censored')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  test('empty Baidu results without a verdict show the connection-error panel', () => {
    render(<ImageCarousel images={{ googleResults: images.googleResults, baiduResults: [] }} />);
    expect(screen.getByText('Unable to Connect')).toBeInTheDocument();
    expect(screen.queryByText('Possibly Censored')).not.toBeInTheDocument();
  });

  test('short result lists are padded to 9 tiles with the broken-link icon', () => {
    // 2 Google results → 7 placeholders; 1 Baidu result → 8 placeholders.
    const { container } = render(<ImageCarousel images={images} />);
    expect(container.querySelectorAll('img[src*="broken-image-placeholder"]')).toHaveLength(15);
    // Only the first placeholder per column is announced; the rest are decorative.
    expect(screen.getAllByAltText('Broken or missing image')).toHaveLength(2);
    // Placeholders are not selectable results.
    expect(screen.getAllByRole('button', { name: /Select Google result/ })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Select Baidu result/ })).toHaveLength(1);
  });

  test('a banned term fills all 9 Baidu tiles with the censored icon', () => {
    const { container } = render(
      <ImageCarousel images={{ googleResults: images.googleResults, baiduResults: [] }} isBanned />
    );
    expect(container.querySelectorAll('img[src*="censored-image-placeholder"]')).toHaveLength(9);
    expect(screen.getAllByAltText('Search term is banned in China')).toHaveLength(1);
  });

  test('source badges are tinted blue for Google and red for Baidu', () => {
    render(<ImageCarousel images={images} />);
    const badges = screen.getAllByTitle(/Open original page/);
    const googleBadge = badges.find(b => b.getAttribute('href') === 'https://example.com/page1');
    const baiduBadge = badges.find(
      b => b.getAttribute('href') === 'https://tv.people.com.cn/article'
    );
    expect(googleBadge.className).toContain('bg-blue-600');
    expect(baiduBadge.className).toContain('bg-red-600');
  });

  test('carousel arrows wrap at the actual result count, not a hardcoded 9', () => {
    render(<ImageCarousel images={images} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select Google result 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByAltText('Google search result 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByAltText('Google search result 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous image' }));
    expect(screen.getByAltText('Google search result 2')).toBeInTheDocument();
  });
});
