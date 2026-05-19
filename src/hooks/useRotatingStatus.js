import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_PROGRESS_CAPTIONS,
  pickRandomCaption,
} from '../components/searchProgressCaptions';

// How long each ordered step is displayed before advancing
const ORDERED_DURATIONS = [800, 1500, 3000];

// Repeating duration cycle for random filler phrases
const FILLER_CYCLE = [1000, 500, 1000, 3000];

export function useRotatingStatus(active, captions = DEFAULT_PROGRESS_CAPTIONS) {
  const orderedSteps = [captions.translating, captions.searchingGoogle, captions.searchingBaidu];
  const [caption, setCaption] = useState(orderedSteps[0]);
  const timerRef = useRef(null);
  const previousFillerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      previousFillerRef.current = null;
      setCaption(orderedSteps[0]);
      return;
    }

    previousFillerRef.current = null;
    setCaption(orderedSteps[0]);

    let cancelled = false;
    let fillerCycleIndex = 0;

    function scheduleNext(nextStepIndex, delay) {
      timerRef.current = setTimeout(() => {
        if (cancelled) return;

        if (nextStepIndex < orderedSteps.length) {
          setCaption(orderedSteps[nextStepIndex]);
          scheduleNext(nextStepIndex + 1, ORDERED_DURATIONS[nextStepIndex]);
        } else {
          const next = pickRandomCaption(captions.fillers, previousFillerRef.current);
          previousFillerRef.current = next;
          setCaption(next);
          const nextDelay = FILLER_CYCLE[fillerCycleIndex % FILLER_CYCLE.length];
          fillerCycleIndex += 1;
          scheduleNext(orderedSteps.length, nextDelay);
        }
      }, delay);
    }

    // Step 0 shown immediately; schedule step 1 after step 0's display duration
    scheduleNext(1, ORDERED_DURATIONS[0]);

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, captions.translating, captions.searchingGoogle, captions.searchingBaidu, captions.fillers]);

  return caption;
}
