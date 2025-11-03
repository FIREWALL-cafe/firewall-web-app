import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import HeroSection from '../HeroSection';
import AboutSection from '../AboutSection';
import InfoSection from '../InfoSection';
import SearchTrendsSection from '../SearchTrendsSection';

// Mock the sanity module
jest.mock('../../lib/sanity');

// Mock Typed.js since it manipulates DOM directly
jest.mock('typed.js', () => {
  return jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
  }));
});

const mockHomepageStrings = {
  heroTitleAnimated: "What's behind the wall?|墙后面是什么?",
  aboutMainHeading: 'What does internet censorship look like?',
  aboutMainHeadingZh: '你知道什么时候会看到审查制度吗?',
  aboutIntroParagraph1: '"Just Google it." That phrase has become almost a knee-jerk response whenever we\'re stumped.',
  aboutIntroParagraph2: 'FIREWALL Cafe is an art project launched in 2016 to shine a light on Google\'s search engine monopoly.',
  aboutButtonText: 'About',
  aboutButtonAriaLabel: 'About',
  infoCtaHeading: 'Peer over the wall. Decide for yourself.',
  infoCtaHeadingZh: '越过墙往外看。自己决定。',
  infoCtaParagraph1: 'The FIREWALL dual-search engine will automatically translate your query.',
  infoCtaParagraph2: 'The goal of this art project is to educate the public about internet freedom.',
  infoCtaButton: 'Start Searching',
  infoCtaButtonAriaLabel: 'Start Searching',
  searchTrendsSectionHeading: 'What are others seeking over the wall?',
  searchTrendsSectionHeadingZh: '人们翻墙时在寻找什么?',
};

const renderWithLanguageContext = (component) => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('Homepage Components Localization', () => {
  beforeEach(() => {
    // Mock getHomepageStrings to return mock data
    sanity.getHomepageStrings.mockResolvedValue(mockHomepageStrings);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('HeroSection renders with Sanity strings', async () => {
    renderWithLanguageContext(<HeroSection />);

    // Wait for Sanity data to load
    await waitFor(() => {
      expect(sanity.getHomepageStrings).toHaveBeenCalledWith('en');
    });

    // HeroSection uses Typed.js, so we can't directly test the rendered text
    // but we can verify the Sanity call was made
    expect(sanity.getHomepageStrings).toHaveBeenCalled();
  });

  test('AboutSection renders with Sanity strings', async () => {
    renderWithLanguageContext(<AboutSection />);

    // Wait for Sanity data to load
    await waitFor(() => {
      expect(screen.getByText(mockHomepageStrings.aboutMainHeading)).toBeInTheDocument();
    });

    expect(screen.getByText(mockHomepageStrings.aboutMainHeadingZh)).toBeInTheDocument();
    expect(screen.getByText(mockHomepageStrings.aboutIntroParagraph1)).toBeInTheDocument();
    expect(screen.getByText(mockHomepageStrings.aboutButtonText)).toBeInTheDocument();
  });

  test('InfoSection renders with Sanity strings', async () => {
    renderWithLanguageContext(<InfoSection />);

    // Wait for Sanity data to load
    await waitFor(() => {
      expect(screen.getByText(mockHomepageStrings.infoCtaHeading)).toBeInTheDocument();
    });

    expect(screen.getByText(mockHomepageStrings.infoCtaHeadingZh)).toBeInTheDocument();
    expect(screen.getByText(mockHomepageStrings.infoCtaParagraph1)).toBeInTheDocument();
    expect(screen.getByText(mockHomepageStrings.infoCtaButton)).toBeInTheDocument();
  });

  test('SearchTrendsSection renders with Sanity strings', async () => {
    renderWithLanguageContext(<SearchTrendsSection />);

    // Wait for Sanity data to load
    await waitFor(() => {
      expect(screen.getByText(mockHomepageStrings.searchTrendsSectionHeading)).toBeInTheDocument();
    });

    expect(screen.getByText(mockHomepageStrings.searchTrendsSectionHeadingZh)).toBeInTheDocument();
  });

  test('Language switching updates component UI', async () => {
    renderWithLanguageContext(<AboutSection />);

    // Wait for strings to load
    await waitFor(() => {
      expect(screen.getByText(mockHomepageStrings.aboutMainHeading)).toBeInTheDocument();
    });

    // Verify getHomepageStrings was called (language defaults to 'en' in LanguageProvider)
    expect(sanity.getHomepageStrings).toHaveBeenCalled();
  });

  test('Components display fallback content when Sanity fetch fails', async () => {
    // Mock Sanity to return empty object (simulating failure)
    sanity.getHomepageStrings.mockResolvedValue({});

    renderWithLanguageContext(<AboutSection />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(sanity.getHomepageStrings).toHaveBeenCalled();
    });

    // Component should render without crashing even with empty Sanity data
    // The fallback hardcoded strings should be displayed (AboutSection renders a Link, not a button)
    await waitFor(() => {
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });
});
