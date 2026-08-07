import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import DynamicPage from '../DynamicPage';
import PageBuilder from '../pageBuilder/PageBuilder';

jest.mock('../../lib/sanity');

const renderAtSlug = (slug) =>
  render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[`/${slug}`]}>
        <Routes>
          <Route path="/:slug" element={<DynamicPage />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );

describe('DynamicPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sanity.urlFor.mockReturnValue({
      width: () => ({ url: () => 'https://cdn.sanity.example/image.jpg' }),
    });
  });

  test('renders bilingual heading and blocks for a published page', async () => {
    sanity.getPageBySlug.mockResolvedValue({
      title: 'Research Residency',
      titleZh: '研究驻留',
      pageBuilder: [
        {
          _type: 'heroBlock',
          _key: 'a1',
          heading: 'Open call for researchers',
          tagline: 'Study search-engine censorship',
        },
        {
          _type: 'ctaBlock',
          _key: 'b2',
          heading: 'Apply by Oct 1',
          buttonText: 'Get in touch',
          url: '/contact',
          variant: 'highlight',
        },
      ],
    });

    renderAtSlug('research-residency');

    await waitFor(() => {
      expect(screen.getByText('Research Residency')).toBeInTheDocument();
    });
    expect(screen.getByText('研究驻留')).toBeInTheDocument();
    expect(screen.getByText('Open call for researchers')).toBeInTheDocument();
    // Internal CTA URL renders as a router link
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute(
      'href',
      '/contact'
    );
    expect(sanity.getPageBySlug).toHaveBeenCalledWith('research-residency', 'en');
  });

  test('shows not-found state when no page matches the slug', async () => {
    sanity.getPageBySlug.mockResolvedValue(null);

    renderAtSlug('no-such-page');

    await waitFor(() => {
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });
});

describe('PageBuilder', () => {
  test('renders nothing for empty or missing blocks', () => {
    const { container } = render(<PageBuilder blocks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('flags unknown block types in development', () => {
    render(
      <PageBuilder blocks={[{ _type: 'legacyBlock', _key: 'x1' }]} />
    );
    expect(screen.getByText(/Block not found: legacyBlock/)).toBeInTheDocument();
  });
});
