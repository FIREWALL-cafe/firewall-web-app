import React, { useState, useEffect, useContext } from 'react';
import { LayoutContext } from './SearchLayout';
import '../style.css';

// A map of vote names for the backend and their related data
const voteMeta = {
  votes_censored: {
    name: 'Censored',
    img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-censored.svg',
  },
  votes_uncensored: {
    name: 'Uncensored',
    img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-uncensored.svg',
  },
  votes_bad_translation: {
    name: 'Bad Translation',
    img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-bad-translation.svg',
  },
  votes_good_translation: {
    name: 'Good Translation',
    img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-good-translation.svg',
  },
  votes_lost_in_translation: {
    name: 'Lost in Translation',
    img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-lost-in-translation.svg',
  },
  votes_nsfw: {
    name: 'NSFW',
    img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-nsfw.svg',
  },
  votes_bad_result: {
    name: 'WTF',
    img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-bad-result.svg',
  },
};

const getVoteName = voteMetaName => voteMeta[voteMetaName] && voteMeta[voteMetaName].name;

const VoteButton = ({ imgSrc, voteId, setVote, isDisabled, setDisabled }) => {
  const { currentSearchId } = useContext(LayoutContext);

  useEffect(() => setDisabled(false), [currentSearchId, setDisabled]);

  const handleVote = async voteId => {
    // Disable vote buttons until another search has completed
    setDisabled(true);
    setVote(voteId);

    /**
    * endpoint: https://firewallcafe.com/wp-admin/admin-ajax.php
    action: fwc_post_vote
    meta_key: votes_uncensored
    post_id: 310504
    security: 83376c1e81
    */
    try {
      const { data } = await fetch('/vote', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meta_key: voteId, search_id: currentSearchId }),
      });

      // await fetch(`/searches/votes/search_id/`)
    } catch (e) {
      // Handle error silently
    }
  };

  return (
    <button
      className="vote__button hover:bg-sky-700"
      disabled={isDisabled}
      onClick={() => handleVote(voteId)}
    >
      <img src={imgSrc} alt={voteMeta[voteId].name} />
    </button>
  );
};

// TODO: disable panel until search returns
const VotePanel = () => {
  const { searchQuery, translation, currentSearchId: _currentSearchId } = useContext(LayoutContext);
  const [currentVote, setVote] = useState(null);
  const [isDisabled, setDisabled] = useState(null);

  return (
    <div className="vote__container">
      <h2>
        <span style={{ color: '#e60011' }}>VOTE</span> by clicking buttons below that match what you
        think about this search result.
      </h2>
      <div className="vote__container vote__button_container">
        {Object.keys(voteMeta).map(v => (
          <VoteButton
            voteId={v}
            imgSrc={voteMeta[v].img}
            setVote={setVote}
            isDisabled={isDisabled}
            setDisabled={setDisabled}
          />
        ))}
      </div>
      {currentVote && (
        <p>
          You voted <span style={{ color: '#e60011' }}>{getVoteName(currentVote)}</span> for "
          {searchQuery}"/"{translation}"
        </p>
      )}
    </div>
  );
};

export default VotePanel;
