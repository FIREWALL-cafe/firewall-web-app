// Maps the `iconSrc`/`iconSrcHover` strings stored on featureCard documents
// (studio/schemas/featureCard.js) to bundled assets. Superset of the per-page
// maps in Search.jsx and SearchArchive.jsx, keyed by asset filename base.
import Archive from '../assets/icons/Archive_grayscale.png';
import ArchiveHover from '../assets/icons/Archive.png';
import SearchIcon from '../assets/icons/search-grayscale.png';
import SearchHover from '../assets/icons/search-color.png';
import Commentary from '../assets/icons/expert-commentary_grayscale.png';
import CommentaryHover from '../assets/icons/expert-commentary.png';
import Timeline from '../assets/icons/Timeline_grayscale.png';
import TimelineHover from '../assets/icons/Timeline.png';

export const featureCardIconMap = {
  Archive_grayscale: Archive,
  Archive: ArchiveHover,
  ArchiveHover: ArchiveHover,
  'search-grayscale': SearchIcon,
  'search-color': SearchHover,
  'expert-commentary_grayscale': Commentary,
  'expert-commentary': CommentaryHover,
  Timeline_grayscale: Timeline,
  Timeline: TimelineHover,
};

export const defaultFeatureCardIcons = {
  iconSrc: Archive,
  iconSrcHover: ArchiveHover,
};
