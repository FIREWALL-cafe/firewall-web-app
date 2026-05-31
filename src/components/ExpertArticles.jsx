import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getEditorialArticles, urlFor } from '../lib/sanity';
import ArticleCard from './ArticleCard';
import ExpertCommentary from '../assets/icons/expert-commentary.png';
import ExpertCommentaryGrayscale from '../assets/icons/expert-commentary_grayscale.png';

function ExpertArticles({ heading, noArticlesMessage }) {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEditorialArticles();
        // Exclude the featured article so it isn't duplicated by FeaturedEditorial
        setArticles((data || []).filter((a) => !a.featured));
      } catch (_) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (value) => {
    if (!value) return '';
    try {
      return new Date(value).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
      });
    } catch (_) {
      return '';
    }
  };

  return (
    <section className="flex flex-col items-center px-2 md:px-14 pt-12 pb-16 w-full border-t border-solid bg-slate-100 border-t-neutral-300 max-md:pb-24 is-full-width-content">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto">
        <h2 className="self-center font-display-04 font-bitmap-song leading-tight text-black max-md:text-4xl">
          {heading || 'Expert Articles'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 w-full max-md:mt-10 justify-items-center">
          {!loading && articles.length === 0 ? (
            <div className="col-span-full text-center">
              {noArticlesMessage || 'No articles available'}
            </div>
          ) : (
            articles.map((article) => (
              <ArticleCard
                key={article._id}
                title={(language === 'zh' && article.titleZh) || article.title}
                date={formatDate(article.publishedDate)}
                url={`/editorial/${article.slug?.current || article.slug}`}
                image={
                  article.authorImage?.asset
                    ? urlFor(article.authorImage).width(512).url()
                    : ExpertCommentaryGrayscale
                }
                imageHover={
                  article.authorImage?.asset
                    ? urlFor(article.authorImage).width(512).url()
                    : ExpertCommentary
                }
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ExpertArticles;
