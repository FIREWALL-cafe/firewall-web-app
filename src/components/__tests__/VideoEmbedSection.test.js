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

  test('renders caption below the poster and rich text below the preview', async () => {
    sanity.getVideoEmbeds.mockResolvedValue([
      {
        ...mockVideos[0],
        caption: 'Filmed in Shanghai, 2019',
        bodyText: [
          {
            _type: 'block',
            _key: 'b1',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 's1', text: 'Longer text below the preview.', marks: [] }],
          },
        ],
      },
    ]);

    renderWithLanguage(<VideoEmbedSection page="editorial" />);

    expect(await screen.findByText('Filmed in Shanghai, 2019')).toBeInTheDocument();
    expect(screen.getByText('Longer text below the preview.')).toBeInTheDocument();
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

  test('renders an uploaded video file and plays it natively in the lightbox', async () => {
    sanity.getVideoEmbeds.mockResolvedValue([
      {
        _id: 'video-file-1',
        vimeoUrl: null,
        videoUrl: 'https://cdn.sanity.io/files/abc/production/film.mp4',
        videoMimeType: 'video/mp4',
        heading: 'Uploaded Film',
        playButtonLabel: 'Play film',
        posterAlt: '',
        posterImage: null,
      },
    ]);

    renderWithLanguage(<VideoEmbedSection page="home" />);

    const playButton = await screen.findByRole('button', { name: 'Play film' });
    // No oEmbed lookup for uploaded files — there is no Vimeo thumbnail.
    expect(global.fetch).not.toHaveBeenCalled();

    fireEvent.click(playButton);

    const dialog = await screen.findByRole('dialog');
    const video = dialog.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video.querySelector('source')).toHaveAttribute(
      'src',
      'https://cdn.sanity.io/files/abc/production/film.mp4',
    );
    expect(video.querySelector('source')).toHaveAttribute('type', 'video/mp4');
    expect(dialog.querySelector('iframe')).not.toBeInTheDocument();
  });

  test('prefers the uploaded file over the Vimeo URL when both are set', async () => {
    sanity.getVideoEmbeds.mockResolvedValue([
      {
        ...mockVideos[0],
        videoUrl: 'https://cdn.sanity.io/files/abc/production/film.mp4',
        videoMimeType: 'video/mp4',
      },
    ]);

    renderWithLanguage(<VideoEmbedSection page="home" />);

    fireEvent.click(await screen.findByRole('button', { name: 'Play trailer' }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog.querySelector('video')).toBeInTheDocument();
    expect(dialog.querySelector('iframe')).not.toBeInTheDocument();
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
