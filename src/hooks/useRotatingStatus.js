import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_PROGRESS_CAPTIONS,
  pickRandomCaption,
} from '../components/searchProgressCaptions';

const CYCLE_MS = 2500;

export function useRotatingStatus(active, captions = DEFAULT_PROGRESS_CAPTIONS) {
  const orderedSteps = [captions.translating, captions.searchingGoogle, captions.searchingBaidu];
  const [caption, setCaption] = useState(orderedSteps[0]);
  const tickRef = useRef(0);
  const previousFillerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      tickRef.current = 0;
      previousFillerRef.current = null;
      setCaption(orderedSteps[0]);
      return undefined;
    }

    tickRef.current = 0;
    previousFillerRef.current = null;
    setCaption(orderedSteps[0]);

    const id = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;
      if (tick < orderedSteps.length) {
        setCaption(orderedSteps[tick]);
      } else {
        const next = pickRandomCaption(captions.fillers, previousFillerRef.current);
        previousFillerRef.current = next;
        setCaption(next);
      }
    }, CYCLE_MS);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, captions.translating, captions.searchingGoogle, captions.searchingBaidu, captions.fillers]);

  return caption;
}
