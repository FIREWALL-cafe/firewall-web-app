import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import * as sanity from '../../lib/sanity';

import VoteButton from '../VoteButton';

// Mock the sanity module
jest.mock('../../lib/sanity');

const mockVoteStrings = {
  voteButtonCensored: 'Censored',
  voteButtonUncensored: 'Uncensored',
  voteButtonBadTranslation: 'Bad Translation',
  voteButtonGoodTranslation: 'Good Translation',
  voteButtonLostInTranslation: 'Lost in Translation',
  voteButtonNsfw: 'NSFW',
  voteButtonWtf: 'WTF',
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

describe('Search Components Localization', () => {
  beforeEach(() => {
    sanity.getVoteStrings.mockResolvedValue(mockVoteStrings);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('VoteButton preserves ID mapping for backend compatibility', async () => {
    const mockVoteHandler = jest.fn();

    renderWithLanguageContext(
      <VoteButton
        voteCategory="votes_censored"
        voteHandler={mockVoteHandler}
        disabled={false}
        shouldReset={false}
        totalVotes={0}
      />
    );

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(mockVoteStrings.voteButtonCensored)).toBeInTheDocument();
    });

    // Verify hidden input exists with correct vote category
    // eslint-disable-next-line testing-library/no-node-access
    const hiddenInput = screen.getByRole('button').querySelector('input[name="votes_censored"]');
    expect(hiddenInput).toBeInTheDocument();
  });

  test('VoteButton handles all vote categories correctly', async () => {
    const voteCategories = [
      'votes_censored',
      'votes_uncensored',
      'votes_bad_translation',
      'votes_good_translation',
      'votes_lost_in_translation',
      'votes_nsfw',
      'votes_bad_result',
    ];

    for (const category of voteCategories) {
      const { unmount } = renderWithLanguageContext(
        <VoteButton
          voteCategory={category}
          voteHandler={jest.fn()}
          disabled={false}
          shouldReset={false}
          totalVotes={0}
        />
      );

      // Wait for component to render with Sanity data
      await waitFor(() => {
        expect(sanity.getVoteStrings).toHaveBeenCalled();
      });

      // Each category should render without errors
      expect(screen.getByRole('button')).toBeInTheDocument();

      unmount();
    }
  });
});
