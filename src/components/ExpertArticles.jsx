import React from 'react';
import ArticleCard from './ArticleCard';
import ExpertCommentary from '../assets/icons/expert-commentary.png';
import ExpertCommentaryGrayscale from '../assets/icons/expert-commentary_grayscale.png';

const articles = [
  {
    title: 'Lan Yu - How internet censorship shapes cultural phenomena',
    date: 'December 2024',
    url: '/editorial/lan-yu',
    description:
      "A shadow journalist with years of on-the-ground reporting experience in China explores internet censorship beyond China's borders.",
  },
  // Add more expert articles here as they become available
];

function ExpertArticles() {
  return (
    <section className="flex flex-col items-center px-2 md:px-14 pt-12 pb-16 w-full border-t border-solid bg-slate-100 border-t-neutral-300 max-md:pb-24 is-full-width-content">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto">
        <h2 className="self-center font-display-04 font-bitmap-song leading-tight text-black max-md:text-4xl">
          Expert Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 w-full max-md:mt-10 justify-items-center">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              date={article.date}
              url={article.url}
              image={ExpertCommentaryGrayscale}
              imageHover={ExpertCommentary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExpertArticles;
