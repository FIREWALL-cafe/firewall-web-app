import React, { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import { getArchivePageStrings } from '../lib/sanity';

import Archive from '../assets/icons/Archive.png';

const HeroArchive = () => {
  const [headings, setHeadings] = useState({
    archivePageHeading: 'Archive',
    archivePageHeadingZh: '存档',
    archiveBodyText: 'Browse what others are searching, vote on their results, and see how they voted too.',
  });

  useEffect(() => {
    async function load() {
      try {
        const strings = await getArchivePageStrings('en');
        if (strings && (strings.archivePageHeading || strings.archivePageHeadingZh)) {
          setHeadings({
            archivePageHeading: strings.archivePageHeading || 'Archive',
            archivePageHeadingZh: strings.archivePageHeadingZh || '存档',
            archiveBodyText: strings.archiveBodyText || 'Browse what others are searching, vote on their results, and see how they voted too.',
          });
        }
      } catch (_) {}
    }
    load();
  }, []);

  return (
    <section className="flex overflow-hidden flex-col justify-center py-16 w-full bg-white max-md:py-24 max-md:max-w-full">
      <div className="flex flex-col justify-center w-full text-center max-md:max-w-full">
        <div className="chinese flex flex-col w-full text-7xl font-medium leading-tight tracking-[2.16px] max-md:max-w-full max-md:text-4xl">
          <div className="flex flex-wrap gap-5 items-center self-center text-black max-md:max-w-full max-md:text-4xl">
            <img
              src={Archive}
              alt=""
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[52px]"
            />
            <div className="self-stretch my-auto border-black max-md:max-w-full max-md:text-4xl">
              {headings.archivePageHeading}
            </div>
          </div>
          <div className="text-red-600 border-red-600 max-md:max-w-full max-md:text-4xl">
            {headings.archivePageHeadingZh}
          </div>
        </div>
        <div className="mt-5 text-lg text-black max-md:max-w-full">
          {headings.archiveBodyText}
        </div>
      </div>
      <SearchInput searchMode="archive" />
    </section>
  );
};

export default HeroArchive;
