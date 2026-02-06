import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import VoteButton from './VoteButton';
import useCookie from '../useCookie';
import QuestionIcon from './icons/QuestionIcon';

import Archive from '../assets/icons/Archive_grayscale.png';
import ExpandDown from '../assets/icons/expand_circle_down.svg';
import ExpandUp from '../assets/icons/expand_circle_up.png';

function VotingSection({ query, searchId }) {
  const location = useLocation();
  const notArchive = location.pathname !== '/archive';
  const [isOpen, setIsOpen] = useState(notArchive);
  const [username] = useCookie('username');

  const [voteCounts, setVoteCounts] = useState({
    votes_censored: 0,
    votes_uncensored: 0,
    votes_lost_in_translation: 0,
    votes_bad_translation: 0,
    votes_good_translation: 0,
  });
  const handleVote = async voteCategory => {
    try {
      const voteResponse = await fetch('/vote', {
        method: 'POST',
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
      setVoteCounts(prevCounts => ({
        ...prevCounts,
        [voteCategory]: voteData.vote_count,
      }));
    } catch (e) {
      console.error('Vote submission failed:', e);
      throw e;
    }
  };

  return (
    <div className="flex overflow-hidden flex-col w-full bg-gray-50 border-t border-red-600 max-md:max-w-full">
      <div className={`${isOpen ? 'visible' : 'hidden'}`}>
        <div className="flex overflow-hidden flex-wrap gap-10 justify-center p-12 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col my-auto min-w-[240px] max-md:max-w-full">
            <div className="flex gap-2.5 items-start w-full min-h-[61px] max-md:max-w-full">
              <div className="flex flex-wrap flex-1 shrink gap-2.5 items-center w-full basis-0 min-w-[240px] max-md:max-w-full">
                <div className="self-stretch my-auto max-md:max-w-full font-body-01">
                  Vote on these search results.
                </div>
                <QuestionIcon
                  fill="#b9c0c7"
                  className="w-6 h-6 text-neutral-500"
                  data-tooltip-id="tooltip-think"
                  data-tooltip-content="Vote on if you think these results are censored or not, or if the search was mistranslated."
                  data-tooltip-place="top"
                />
                <Tooltip id="tooltip-think" border={'1px solid #e60011'} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch w-full rounded-md max-md:max-w-full">
              <VoteButton
                voteCategory="votes_censored"
                voteHandler={handleVote}
                disabled={false}
                totalVotes={voteCounts.votes_censored}
              />
              <VoteButton
                voteCategory="votes_uncensored"
                voteHandler={handleVote}
                disabled={false}
                totalVotes={voteCounts.votes_uncensored}
              />
              <VoteButton
                voteCategory="votes_lost_in_translation"
                voteHandler={handleVote}
                disabled={false}
                totalVotes={voteCounts.votes_lost_in_translation}
              />
            </div>
          </div>
          <div className="flex overflow-hidden justify-center items-start h-full min-w-[240px]">
            <div className="flex flex-col min-w-[240px]">
              <div className="flex gap-2.5 items-start w-full font-body-01 min-h-[61px]">
                <div className="flex flex-1 shrink gap-2.5 items-center w-full basis-0 min-w-[240px]">
                  <div className="self-stretch my-auto">Review this translation.</div>
                  <QuestionIcon
                    fill="#b9c0c7"
                    className="w-6 h-6 text-neutral-500"
                    data-tooltip-id="tooltip-how"
                    data-tooltip-content="Bilingual users are invited to vote on the quality of the translation."
                    data-tooltip-place="top"
                  />
                  <Tooltip id="tooltip-how" border={'1px solid #e60011'} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch w-full rounded-md">
                <VoteButton
                  voteCategory="votes_bad_translation"
                  voteHandler={handleVote}
                  disabled={false}
                  totalVotes={voteCounts.votes_bad_translation}
                />
                <VoteButton
                  voteCategory="votes_good_translation"
                  voteHandler={handleVote}
                  disabled={false}
                  totalVotes={voteCounts.votes_good_translation}
                />
              </div>
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
                  <Link to={`/archive?q=${query}`}>
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
