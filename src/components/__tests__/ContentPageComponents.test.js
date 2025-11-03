import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import About from '../About';
import Experts from '../Experts';
import Press from '../Press';
import Support from '../Support';
import Contact from '../Contact';

// Mock the sanity module
jest.mock('../../lib/sanity');

const renderWithLanguageContext = (component) => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('Content Page Components Localization', () => {
  beforeEach(() => {
    // Mock all Sanity query functions with test data
    sanity.getAboutPageStrings.mockResolvedValue({
      aboutPageHeading: 'What do we lose in the dark?',
      aboutPageHeadingZh: '我们在黑暗中失去了什么?',
      aboutRedSectionHeading: 'FIREWALL came face to face with that abuse in 2016.',
      aboutRedSectionHeadingZh: '防火墙在 2016 年就遭遇过这种滥用。',
      aboutArtistSectionHeading: 'About Joyce',
      aboutArtistSectionHeadingZh: '关于乔伊斯',
    });

    sanity.getEditorialPageStrings.mockResolvedValue({
      editorialPageHeading: 'Expert commentary',
      editorialPageHeadingZh: '专家点评',
      editorialIntroText: 'We\'ve invited journalists, scholars, and social activists from around the world',
    });

    sanity.getPressPageStrings.mockResolvedValue({
      pressPageHeading: 'In the press',
      pressPageHeadingZh: '在新闻界',
      pressIntroText: 'Since its inception, FIREWALL Cafe has garnered media attention',
    });

    sanity.getSupportPageStrings.mockResolvedValue({
      supportPageHeading: 'Support the frontline of internet freedom advocates',
      supportPageHeadingZh: '支持互联网自由战士的前线。',
    });

    sanity.getContactPageStrings.mockResolvedValue({
      contactPageHeading: 'Get in touch',
      contactPageHeadingZh: '联系我们',
    });

    // Mock homepage strings for NewsletterSection used in sub-components
    sanity.getHomepageStrings.mockResolvedValue({
      newsletterHeading: 'Stay connected',
      newsletterSubheading: 'Get updates about upcoming events',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('About page renders with Sanity strings', async () => {
    renderWithLanguageContext(<About />);

    // Wait for Sanity data to load and content to render
    await waitFor(() => {
      expect(screen.getByText('What do we lose in the dark?')).toBeInTheDocument();
    });

    // Verify Sanity function was called
    expect(sanity.getAboutPageStrings).toHaveBeenCalledWith('en');
  });

  test('Editorial page renders with Sanity strings', async () => {
    renderWithLanguageContext(<Experts />);

    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('Expert commentary')).toBeInTheDocument();
    });

    expect(screen.getByText('专家点评')).toBeInTheDocument();
    expect(sanity.getEditorialPageStrings).toHaveBeenCalledWith('en');
  });

  test('Press page renders with Sanity strings', async () => {
    renderWithLanguageContext(<Press />);

    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('In the press')).toBeInTheDocument();
    });

    expect(screen.getByText('在新闻界')).toBeInTheDocument();
    expect(sanity.getPressPageStrings).toHaveBeenCalledWith('en');
  });

  test('Support page renders with Sanity strings', async () => {
    renderWithLanguageContext(<Support />);

    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText(/Support the frontline of/i)).toBeInTheDocument();
    });

    expect(sanity.getSupportPageStrings).toHaveBeenCalledWith('en');
  });

  test('Contact page renders with Sanity strings', async () => {
    renderWithLanguageContext(<Contact />);

    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('Get in touch')).toBeInTheDocument();
    });

    // Chinese text appears in both mobile and desktop layouts
    expect(screen.getAllByText('联系我们').length).toBeGreaterThan(0);
    expect(sanity.getContactPageStrings).toHaveBeenCalledWith('en');
  });
});
