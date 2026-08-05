import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import FilmPage from '../FilmPage';

jest.mock('../../lib/sanity');

const basePage = {
  heading: 'Invisible Visible',
  headingZh: '看不见的看得见',
  caption: 'The full documentary',
  bodyText: [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: 's1', text: 'About the film.', marks: [] }],
    },
  ],
  posterImage: null,
  posterAlt: '',
};

const renderPage = () =>
  render(
    <LanguageProvider>
      <FilmPage />
    </LanguageProvider>
  );

describe('FilmPage', () => {
  afterEach(() => jest.clearAllMocks());

  test('plays a Sanity-hosted file with the native player', async () => {
    sanity.getVideoPage.mockResolvedValue({
      ...basePage,
      videoUrl: 'https://cdn.sanity.io/files/6i3e0mnh/production/film.mp4',
      videoMimeType: 'video/mp4',
      vimeoUrl: null,
    });

    renderPage();

    const video = await screen.findByLabelText('Invisible Visible');
    expect(video.tagName).toBe('VIDEO');
    expect(video.querySelector('source')).toHaveAttribute(
      'src',
      'https://cdn.sanity.io/files/6i3e0mnh/production/film.mp4'
    );
    expect(screen.getByText('The full documentary')).toBeInTheDocument();
    expect(screen.getByText('About the film.')).toBeInTheDocument();
  });

  test('falls back to a non-autoplay Vimeo embed when no file is uploaded', async () => {
    sanity.getVideoPage.mockResolvedValue({
      ...basePage,
      videoUrl: null,
      videoMimeType: null,
      vimeoUrl: 'https://vimeo.com/1207538492',
    });

    renderPage();

    const iframe = await screen.findByTitle('Invisible Visible');
    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe.getAttribute('src')).toContain('player.vimeo.com/video/1207538492');
    expect(iframe.getAttribute('src')).not.toContain('autoplay=1');
  });

  test('shows a friendly message when no video is configured', async () => {
    sanity.getVideoPage.mockResolvedValue(null);

    renderPage();

    expect(await screen.findByText('The film is not available yet.')).toBeInTheDocument();
  });
});
