import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import VideoEmbedSection from '../VideoEmbedSection';

jest.mock('../../lib/sanity');

const mockVideos = [
  {
    _id: 'video-1',
    vimeoUrl: 'https://vimeo.com/1207538492',
    heading: 'Invisible Visible',
    description: 'A short trailer.',
    playButtonLabel: 'Play trailer',
    posterAlt: 'Trailer poster',
    posterImage: null,
  },
];

const renderWithLanguage = (component) =>
  render(<LanguageProvider>{component}</LanguageProvider>);

describe('VideoEmbedSection', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ thumbnailUrl: 'https://i.vimeocdn.com/poster.jpg' }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders videos for the given placement', async () => {
    sanity.getVideoEmbeds.mockResolvedValue(mockVideos);

    renderWithLanguage(<VideoEmbedSection page="home" />);

    await waitFor(() => {
      expect(sanity.getVideoEmbeds).toHaveBeenCalledWith('home', 'en');
    });

    expect(await screen.findByText('Invisible Visible')).toBeInTheDocument();
    expect(screen.getByText('A short trailer.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play trailer' })).toBeInTheDocument();
  });

  test('renders nothing when there are no videos for the placement', async () => {
    sanity.getVideoEmbeds.mockResolvedValue([]);

    const { container } = renderWithLanguage(<VideoEmbedSection page="editorial" />);

    await waitFor(() => {
      expect(sanity.getVideoEmbeds).toHaveBeenCalledWith('editorial', 'en');
    });

    expect(container).toBeEmptyDOMElement();
  });

  test('opens the lightbox with the Vimeo iframe on play click', async () => {
    sanity.getVideoEmbeds.mockResolvedValue(mockVideos);

    renderWithLanguage(<VideoEmbedSection page="home" />);

    const playButton = await screen.findByRole('button', { name: 'Play trailer' });
    fireEvent.click(playButton);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // The lightbox iframe is titled with the video heading.
    const iframe = screen.getByTitle('Invisible Visible');
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining('player.vimeo.com/video/1207538492'),
    );
  });
});
