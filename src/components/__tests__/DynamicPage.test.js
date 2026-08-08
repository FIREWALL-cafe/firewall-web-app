import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import DynamicPage from '../DynamicPage';
import PageBuilder from '../pageBuilder/PageBuilder';

jest.mock('../../lib/sanity');

// Test-only control to flip the language from inside the provider
function LanguageToggleProbe() {
  const { toggleLanguage } = useLanguage();
  return <button onClick={toggleLanguage}>toggle-lang</button>;
}

const renderAtSlug = (slug) =>
  render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[`/${slug}`]}>
        <LanguageToggleProbe />
        <Routes>
          <Route path="/:slug" element={<DynamicPage />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );

// NOTE: DynamicPage keeps a module-level page cache, which persists across
// tests in this file — each test uses a distinct slug to stay isolated.
describe('DynamicPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
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

  test('keeps current content visible while a language change refetches', async () => {
    let resolveZh;
    sanity.getPageBySlug.mockImplementation((slug, lang) => {
      if (lang === 'en') {
        return Promise.resolve({ title: 'Toggle Page', pageBuilder: [] });
      }
      return new Promise((resolve) => {
        resolveZh = resolve;
      });
    });

    renderAtSlug('toggle-page');
    await waitFor(() => {
      expect(screen.getByText('Toggle Page')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('toggle-lang'));

    // Old-language content stays up — no blank/skeleton state
    expect(screen.getByText('Toggle Page')).toBeInTheDocument();
    expect(screen.queryByTestId('page-skeleton')).not.toBeInTheDocument();

    await act(async () => {
      resolveZh({ title: '切换页面', pageBuilder: [] });
    });
    expect(screen.getByText('切换页面')).toBeInTheDocument();
    expect(sanity.getPageBySlug).toHaveBeenCalledWith('toggle-page', 'zh');
  });

  test('renders instantly from cache on revisit, then revalidates', async () => {
    sanity.getPageBySlug.mockResolvedValue({ title: 'Cached Page', pageBuilder: [] });
    const { unmount } = renderAtSlug('cached-page');
    await waitFor(() => {
      expect(screen.getByText('Cached Page')).toBeInTheDocument();
    });
    unmount();

    // Second visit: fetch never resolves — content must come from the cache
    sanity.getPageBySlug.mockReturnValue(new Promise(() => {}));
    renderAtSlug('cached-page');
    expect(screen.getByText('Cached Page')).toBeInTheDocument();
    // ...but a background revalidation request was still made
    expect(sanity.getPageBySlug).toHaveBeenCalledTimes(2);
  });

  test('shows no skeleton before the delay, then a skeleton while loading', async () => {
    jest.useFakeTimers();
    try {
      sanity.getPageBySlug.mockReturnValue(new Promise(() => {}));
      renderAtSlug('slow-page');

      // Within the first 250ms: blank placeholder, no skeleton yet
      expect(screen.queryByTestId('page-skeleton')).not.toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(screen.getByTestId('page-skeleton')).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
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
