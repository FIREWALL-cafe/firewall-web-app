import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import ExpertArticles from '../ExpertArticles';

jest.mock('../../lib/sanity');

const featuredArticle = {
  _id: 'article-1',
  title: 'The Featured One',
  slug: { current: 'featured-one' },
  publishedDate: '2026-07-01',
  featured: true,
};

const trailerVideo = {
  _id: 'video-1',
  vimeoUrl: 'https://vimeo.com/1207538492',
  heading: 'Invisible Visible',
  headingZh: null,
  posterImage: null,
};

const renderGrid = () =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <ExpertArticles />
      </LanguageProvider>
    </MemoryRouter>
  );

describe('ExpertArticles', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ thumbnailUrl: 'https://i.vimeocdn.com/poster.jpg' }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('trailer appears as a card even when the only article is featured', async () => {
    sanity.getEditorialArticles.mockResolvedValue([featuredArticle]);
    sanity.getVideoEmbeds.mockResolvedValue([trailerVideo]);

    renderGrid();

    expect(await screen.findByText('Invisible Visible')).toBeInTheDocument();
    // Featured article is excluded from the grid (it renders in the hero) and
    // the video card keeps the grid from showing the empty message.
    expect(screen.queryByText('The Featured One')).not.toBeInTheDocument();
    expect(screen.queryByText('No articles available')).not.toBeInTheDocument();
  });

  test('clicking the trailer card opens the lightbox instead of navigating', async () => {
    sanity.getEditorialArticles.mockResolvedValue([]);
    sanity.getVideoEmbeds.mockResolvedValue([trailerVideo]);

    renderGrid();

    const cardTitle = await screen.findByText('Invisible Visible');
    expect(cardTitle.closest('a')).toBeNull();
    fireEvent.click(cardTitle);
    expect(await screen.findByRole('dialog', { name: 'Invisible Visible' })).toBeInTheDocument();
  });

  test('fetch failure shows an error message, not the empty state', async () => {
    sanity.getEditorialArticles.mockRejectedValue(new Error('network down'));
    sanity.getVideoEmbeds.mockResolvedValue([]);

    renderGrid();

    expect(
      await screen.findByText('Unable to load articles — please refresh to try again.')
    ).toBeInTheDocument();
    expect(screen.queryByText('No articles available')).not.toBeInTheDocument();
  });
});
