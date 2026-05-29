import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getFeaturedPressArticle, urlFor } from '../lib/sanity';

import PressPost from '../assets/images/press-washington_post.jpg';

const FALLBACK = {
  featuredLabel: 'Featured',
  articleTitle: 'How a New York art show about Chinese online censorship found itself censored',
  articleTitleZh: '图表标题',
  excerpt: 'On the eve of the event, one of the speakers, a visiting Chinese feminist who had done significant work on gender law issues, suddenly started receiving threats.',
  externalUrl: 'https://www.washingtonpost.com/news/worldviews/wp/2016/03/11/how-a-new-york-art-show-about-chinese-online-censorship-found-itself-censored/',
  readArticleLabel: 'Read article',
};

function FeaturedArticle() {
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFeaturedPressArticle(language);
        if (data) setArticle(data);
      } catch (_) {}
    }
    load();
  }, [language]);

  const data = article || FALLBACK;
  const imageSrc = article?.image?.asset ? urlFor(article.image).width(800).url() : PressPost;
  const imageAlt = article?.image?.alt || 'Featured article illustration';

  return (
    <section className="flex overflow-hidden justify-center items-start pb-16 w-full bg-white max-md:pb-24 is-medium-width-content">
      <div className="flex flex-col lg:flex-row gap-10 justify-center w-full">
        <div className="flex flex-col lg:flex-1 justify-center items-center lg:order-2">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="object-contain max-w-full aspect-[1.47]"
          />
        </div>
        <div className="flex flex-col lg:flex-1 text-2xl lg:order-1">
          <div className="flex flex-col w-full">
            <div className="font-body-01 text-neutral-600">{data.featuredLabel}</div>
            <div className="font-bitmap-song font-display-04 md:font-display-04 flex flex-col mt-10 w-full">
              <h2 className="">{data.articleTitle}</h2>
              <div className="leading-tight text-red-600 max-md:text-4xl">{data.articleTitleZh}</div>
            </div>
            <p className="mt-10 leading-9 text-black">{data.excerpt}</p>
            <a
              href={data.externalUrl}
              target="_blank"
              className="flex gap-1 justify-center items-center self-start px-4 mt-10 text-xl text-center text-red-600 bg-white rounded border border-red-600 border-solid min-h-[56px]"
              rel="noreferrer"
            >
              <span className="self-stretch my-auto">{data.readArticleLabel}</span>
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

export default FeaturedArticle;
