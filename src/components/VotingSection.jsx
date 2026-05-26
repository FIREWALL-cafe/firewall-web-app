import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import VoteButton from './VoteButton';
import useCookie from '../useCookie';
import QuestionIcon from './icons/QuestionIcon';

import Archive from '../assets/icons/Archive_grayscale.png';
import ExpandDown from '../assets/icons/expand_circle_down.svg';
import ExpandUp from '../assets/icons/expand_circle_up.png';

// Maps backend vote_id (1-7) to the frontend meta_key used by VoteButton
const voteIdToMetaKey = {
  1: 'votes_censored',
  2: 'votes_uncensored',
  3: 'votes_bad_translation',
  4: 'votes_good_translation',
  5: 'votes_lost_in_translation',
  6: 'votes_bad_result',
  7: 'votes_nsfw',
};

const emptyVoteCounts = {
  votes_censored: 0,
  votes_uncensored: 0,
  votes_lost_in_translation: 0,
  votes_bad_translation: 0,
  votes_good_translation: 0,
  votes_bad_result: 0,
  votes_nsfw: 0,
};

function VotingSection({ query, searchId }) {
  const location = useLocation();
  const notArchive = location.pathname !== '/archive';
  const [isOpen, setIsOpen] = useState(notArchive);
  const [username] = useCookie('username');

  const [voteCounts, setVoteCounts] = useState(emptyVoteCounts);
  const [hasVoted, setHasVoted] = useState(false);
  // Track which categories the user has voted in (set of meta_keys)
  const [votedCategories, setVotedCategories] = useState(new Set());

  // Fetch existing vote counts for this search so prior totals are visible
  // before the user casts a new vote.
  useEffect(() => {
    if (!searchId) return;
    let cancelled = false;

    const fetchVoteCounts = async () => {
      try {
        const response = await fetch(
          `/api/votes/counts-by-search-id?search_id=${encodeURIComponent(searchId)}`,
          { headers: { Accept: 'application/json' } },
        );
        if (!response.ok) {
          throw new Error(`Failed to load vote counts: ${response.status}`);
        }
        const rows = await response.json();
        if (cancelled || !Array.isArray(rows)) return;

        const nextCounts = { ...emptyVoteCounts };
        rows.forEach(row => {
          const metaKey = voteIdToMetaKey[row.vote_id];
          if (metaKey) {
            nextCounts[metaKey] = parseInt(row.vote_count, 10) || 0;
          }
        });
        setVoteCounts(nextCounts);
      } catch (error) {
        console.error('Failed to load existing vote counts:', error);
      }
    };

    fetchVoteCounts();
    return () => {
      cancelled = true;
    };
  }, [searchId]);

  const handleVote = async voteCategory => {
    const isToggleOff = votedCategories.has(voteCategory);

    try {
      const voteResponse = await fetch('/vote', {
        method: isToggleOff ? 'DELETE' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meta_key: voteCategory,
          search_id: searchId,
          vote_client_name: username,
        }),
      });
      if (!voteResponse.ok) {
        throw new Error(`Vote failed: ${voteResponse.status}`);
      }
      const voteData = await voteResponse.json();
      setHasVoted(true);

      // Update voted categories
      setVotedCategories(prev => {
        const next = new Set(prev);
        if (isToggleOff) {
          next.delete(voteCategory);
        } else {
          next.add(voteCategory);
        }
        return next;
      });

      if (voteData.vote_counts) {
        // DELETE returns all vote counts
        const nextCounts = { ...emptyVoteCounts };
        voteData.vote_counts.forEach(row => {
          const metaKey = voteIdToMetaKey[row.vote_id];
          if (metaKey) {
            nextCounts[metaKey] = parseInt(row.vote_count, 10) || 0;
          }
        });
        setVoteCounts(nextCounts);
      } else {
        // POST returns single category count
        setVoteCounts(prevCounts => ({
          ...prevCounts,
          [voteCategory]: parseInt(voteData.vote_count, 10) || 0,
        }));
      }
    } catch (e) {
      console.error('Vote submission failed:', e);
      throw e;
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 border-t border-red-600 max-md:max-w-full">
      <div className={`${isOpen ? 'visible' : 'hidden'}`}>
        <div className="flex flex-row flex-wrap gap-10 p-12 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col gap-8">
            <div className="flex gap-2.5 items-center min-h-[61px]">
              <div className="font-body-01">What do you think about these search results?</div>
              <QuestionIcon
                fill="#b9c0c7"
                className="w-6 h-6 text-neutral-500"
                data-tooltip-id="tooltip-think"
                data-tooltip-content="Vote on if you think these results are censored or not, or if the search was mistranslated."
                data-tooltip-place="top"
              />
              <Tooltip id="tooltip-think" border={'1px solid #e60011'} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch rounded-md">
              <VoteButton
                voteCategory="votes_censored"
                voteHandler={handleVote}
                totalVotes={voteCounts.votes_censored}
                hasVoted={hasVoted}
                votedCategories={votedCategories}
              />
              <VoteButton
                voteCategory="votes_uncensored"
                voteHandler={handleVote}
                totalVotes={voteCounts.votes_uncensored}
                hasVoted={hasVoted}
                votedCategories={votedCategories}
              />
              <VoteButton
                voteCategory="votes_lost_in_translation"
                voteHandler={handleVote}
                totalVotes={voteCounts.votes_lost_in_translation}
                hasVoted={hasVoted}
                votedCategories={votedCategories}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex gap-2.5 items-center min-h-[61px]">
              <div className="font-body-01">How is this translation?</div>
              <QuestionIcon
                fill="#b9c0c7"
                className="w-6 h-6 text-neutral-500"
                data-tooltip-id="tooltip-how"
                data-tooltip-content="Bilingual users are invited to vote on the quality of the translation."
                data-tooltip-place="top"
              />
              <Tooltip id="tooltip-how" border={'1px solid #e60011'} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch rounded-md">
              <VoteButton
                voteCategory="votes_bad_translation"
                voteHandler={handleVote}
                totalVotes={voteCounts.votes_bad_translation}
                hasVoted={hasVoted}
                votedCategories={votedCategories}
              />
              <VoteButton
                voteCategory="votes_good_translation"
                voteHandler={handleVote}
                totalVotes={voteCounts.votes_good_translation}
                hasVoted={hasVoted}
                votedCategories={votedCategories}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-10 justify-end items-center w-full text-center bg-gray-50 border-solid border-t-[1.28px] border-t-neutral-500 max-md:px-5 max-md:max-w-full">
          <div className="flex gap-6 md:text-center text-xl min-w-[240px] max-md:max-w-full">
            {notArchive && (
              <div className="flex gap-2.5 md:text-center min-w-[240px] max-md:max-w-full p-8">
                <div className="self-stretch my-auto font-body-03 md:text-center">
                  See past results for this query in the
                </div>
                <div className="flex gap-2 items-center self-stretch my-auto text-red-600">
                  <img
                    src={Archive}
                    className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
                    alt="Archive"
                  />
                  <Link
                    to={`/archive?q=${query}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="self-stretch my-auto underline">
                      <span className="font-bold text-red-600">Archive</span>
                      <span className="text-red-600">.</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!notArchive && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-wrap justify-between text-red-600 items-center px-8 py-5 bg-gray-50 max-md:px-5 max-md:max-w-full cursor-pointer"
        >
          <div className="font-body-02">{isOpen ? 'Hide voting' : 'Cast your vote'}</div>
          <div>
            <img src={isOpen ? ExpandUp : ExpandDown} alt={isOpen ? 'Collapse' : 'Expand'} />
          </div>
        </div>
      )}
    </div>
  );
}

export default VotingSection;
