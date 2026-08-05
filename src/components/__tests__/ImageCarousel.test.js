import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageCarousel from '../ImageCarousel';

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

  test('empty Baidu results with a hard_censored verdict show the censored panel', () => {
    render(
      <ImageCarousel
        images={{
          googleResults: images.googleResults,
          baiduResults: [],
          censorship: { verdict: 'hard_censored', confidence: 0.85 },
        }}
      />
    );
    expect(screen.getByText('Possibly Censored')).toBeInTheDocument();
    expect(screen.queryByText('Unable to Connect')).not.toBeInTheDocument();
  });

  test('empty Baidu results without a verdict show the connection-error panel', () => {
    render(<ImageCarousel images={{ googleResults: images.googleResults, baiduResults: [] }} />);
    expect(screen.getByText('Unable to Connect')).toBeInTheDocument();
    expect(screen.queryByText('Possibly Censored')).not.toBeInTheDocument();
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
