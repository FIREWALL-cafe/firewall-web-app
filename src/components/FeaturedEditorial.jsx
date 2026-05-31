import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getFeaturedEditorialArticle } from '../lib/sanity';

function FeaturedEditorial({ featuredLabel, featuredSectionBody, readMoreLabel }) {
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFeaturedEditorialArticle();
        if (data) setArticle(data);
      } catch (_) {}
    }
    load();
  }, []);

  // Don't render the section until we have a featured article from Sanity
  if (!article) return null;

  const titleEn = article.title;
  const titleZh = article.titleZh;
  const excerpt =
    (language === 'zh' && article.excerptZh) || article.excerpt || '';
  const body = featuredSectionBody || excerpt;
  const slug = article.slug?.current || article.slug;

  return (
    <section className="flex overflow-hidden justify-center items-start pb-16 w-full bg-white max-md:pb-24 max-md:max-w-full">
      <div className="flex flex-wrap flex-1 shrink gap-10 justify-center w-full basis-0 max-md:max-w-full">
        <div className="flex flex-col flex-1 shrink my-auto basis-0">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="font-body-01 text-neutral-600">{featuredLabel || 'Featured'}</div>
            <div className="font-bitmap-song flex flex-col mt-10 w-full font-medium max-md:max-w-full">
              <h2 className="font-display-04 leading-[58px] max-md:max-w-full max-md:leading-[54px]">
                {titleEn}
              </h2>
              {titleZh && (
                <div className="font-display-04 leading-tight text-red-600 max-md:max-w-full">
                  {titleZh}
                </div>
              )}
            </div>
            <p className="mt-10 leading-9 text-black max-md:max-w-full font-body-01">
              {body}
            </p>
            <a
              href={`/editorial/${slug}`}
              className="flex gap-1 justify-center items-center self-start px-4 mt-10 text-xl text-center text-red-600 bg-white rounded border border-red-600 border-solid min-h-[56px]"
            >
              <span className="self-stretch my-auto">{readMoreLabel || 'Read article'}</span>
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedEditorial;
