import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getVoteStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';

import VisibilityOff from '../assets/icons/visibility_off.svg';
import Visibility from '../assets/icons/visibility.svg';
import ThumbDown from '../assets/icons/thumb_down.svg';
import ThumbUp from '../assets/icons/thumb_up.svg';
import LostInTranslation from '../assets/icons/lost_in_translation.svg';
import VoteIcon from '../assets/icons/how_to_vote.svg';

/**
 * Wordpress vote endpoint
 *
 * endpoint: https://firewallcafe.com/wp-admin/admin-ajax.php
action: fwc_post_vote
meta_key: votes_uncensored
post_id: 310504
security: 83376c1e81
*/

function VoteButton({ voteCategory, voteHandler, shouldReset, totalVotes, toggle = false, hasVoted = false, votedCategories = new Set(), isSelected: isSelectedProp, compact = false, nameOverride }) {
  const { language } = useLanguage();
  const [isToggleSelected, setToggleSelected] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [voteLabels, setVoteLabels] = useState({});

  // Fetch vote strings from Sanity on mount and language change
  useEffect(() => {
    async function loadVoteStrings() {
      try {
        const strings = await getVoteStrings(language);
        setVoteLabels(strings);
      } catch (error) {
        console.error('Failed to load vote strings:', error);
        // Language-aware fallback
        setVoteLabels({
          voteButtonCensored: getDefault('vote', 'voteButtonCensored', language),
          voteButtonUncensored: getDefault('vote', 'voteButtonUncensored', language),
          voteButtonBadTranslation: getDefault('vote', 'voteButtonBadTranslation', language),
          voteButtonGoodTranslation: getDefault('vote', 'voteButtonGoodTranslation', language),
          voteButtonLostInTranslation: getDefault('vote', 'voteButtonLostInTranslation', language),
          voteButtonNsfw: getDefault('vote', 'voteButtonNsfw', language),
          voteButtonWtf: getDefault('vote', 'voteButtonWtf', language),
        });
      }
    }

    loadVoteStrings();
  }, [language]);

  // Reset state when shouldReset changes
  useEffect(() => {
    if (shouldReset) {
      setToggleSelected(false);
      setSubmitting(false);
      const votebtn = document.getElementById(voteCategory);
      if (votebtn) votebtn.value = '';
    }
  }, [shouldReset, voteCategory]);

  // PRESERVE backend ID mapping (1-7) - DO NOT CHANGE
  const metaKeyToId = {
    votes_censored: 1,
    votes_uncensored: 2,
    votes_bad_translation: 3,
    votes_good_translation: 4,
    votes_lost_in_translation: 5,
    votes_bad_result: 6,
    votes_nsfw: 7,
  };

  // ONLY replace .name values with Sanity strings
  const voteMeta = {
    votes_censored: {
      id: metaKeyToId['votes_censored'],
      name: voteLabels.voteButtonCensored || 'Censored',
      img: VisibilityOff,
    },
    votes_uncensored: {
      id: metaKeyToId['votes_uncensored'],
      name: voteLabels.voteButtonUncensored || 'Not censored',
      img: Visibility,
    },
    votes_bad_translation: {
      id: metaKeyToId['votes_bad_translation'],
      name: voteLabels.voteButtonBadTranslation || 'Bad Translation',
      img: ThumbDown,
    },
    votes_good_translation: {
      id: metaKeyToId['votes_good_translation'],
      name: voteLabels.voteButtonGoodTranslation || 'Good Translation',
      img: ThumbUp,
    },
    votes_lost_in_translation: {
      id: metaKeyToId['votes_lost_in_translation'],
      name: voteLabels.voteButtonLostInTranslation || 'Lost in translation',
      img: LostInTranslation,
    },
    votes_nsfw: {
      id: metaKeyToId['votes_nsfw'],
      name: voteLabels.voteButtonNsfw || 'NSFW',
      img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-nsfw.svg',
    },
    votes_bad_result: {
      id: metaKeyToId['votes_bad_result'],
      name: voteLabels.voteButtonWtf || 'WTF',
      img: 'https://firewallcafe.com/wp-content/themes/fwc/img/vote-buttons-bad-result.svg',
    },
  };

  const imgSrc = voteMeta[voteCategory].img;
  const displayName = nameOverride || voteMeta[voteCategory].name;
  const isControlled = toggle && isSelectedProp !== undefined;
  const isSelected = toggle
    ? (isControlled ? isSelectedProp : isToggleSelected)
    : votedCategories.has(voteCategory);

  const vote = async e => {
    e.preventDefault();
    if (toggle) {
      if (isControlled) {
        voteHandler(voteCategory, !isSelectedProp);
      } else {
        const newSelected = !isToggleSelected;
        setToggleSelected(newSelected);
        voteHandler(voteCategory, newSelected);
      }
      return;
    }
    setSubmitting(true);
    try {
      await voteHandler(voteCategory);
    } finally {
      setSubmitting(false);
    }
  };

  if (compact) {
    return (
      <button
        className={`
          flex items-center gap-2 px-3 py-2 rounded border
          ${isSelected ? 'bg-[#eff2f5] border-black' : 'bg-white border-neutral-500 hover:bg-neutral-100'}
          ${isSubmitting ? 'cursor-wait opacity-50' : ''}
        `}
        onClick={vote}
        disabled={isSubmitting}
      >
        <img src={imgSrc} className="w-8 h-8 shrink-0" alt={displayName} />
        <span className="font-medium text-[17px] leading-[1.5] whitespace-nowrap">{displayName}</span>
      </button>
    );
  }

  return (
    <button
      className={`
        flex flex-col items-start justify-between
        w-full md:w-[190px] h-[124px]
        p-3
        rounded-lg
        border border-solid border-neutral-500
        ${isSubmitting ? 'cursor-wait opacity-50' : 'hover:bg-neutral-200'}
        ${isSelected ? 'bg-neutral-200' : ''}
      `}
      onClick={vote}
      disabled={isSubmitting}
    >
      <div
        id={`${voteMeta[voteCategory].name}-vote-icon`}
        className="w-full flex justify-between items-start"
      >
        <img src={imgSrc} className="w-9 h-9" alt={displayName} />
        {hasVoted && totalVotes > 0 && (
          <div className="flex items-center gap-1">
            <span className="font-body-02-bold-sm">{totalVotes}</span>
            <img src={VoteIcon} className="w-6 h-6" alt="Vote count" />
          </div>
        )}
      </div>
      <input type="hidden" id={voteCategory} name={voteCategory} />
      <div className="font-body-02-bold-sm w-full text-left">{displayName}</div>
    </button>
  );
}

export default VoteButton;
