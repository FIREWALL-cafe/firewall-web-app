import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { useLanguage } from '../context/LanguageContext';
import { getPressArticles, getPressPageStrings, urlFor } from '../lib/sanity';

function ArticleGrid() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterLabels, setFilterLabels] = useState({
    all: 'All articles',
    english: 'English',
    chinese: '中文',
  });

  useEffect(() => {
    async function loadStrings() {
      try {
        const strings = await getPressPageStrings(language);
        setFilterLabels({
          all: strings?.pressFilterAllButton || 'All articles',
          english: strings?.pressFilterEnglishButton || 'English',
          chinese: strings?.pressFilterChineseButton || '中文',
        });
      } catch (_) {}
    }
    loadStrings();
  }, [language]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await getPressArticles();

        // Transform Sanity data to match ArticleCard props
        const transformedArticles = data.map(article => ({
          image: article.image ? urlFor(article.image).width(512).url() : null,
          imageHover: article.imageHover ? urlFor(article.imageHover).width(512).url() : null,
          title: article.title,
          url: article.url,
          date: article.date,
          source: article.source,
          language: article.language,
          note: article.note,
        }));

        setArticles(transformedArticles);
        setError(null);
      } catch (err) {
        console.error('Error fetching press articles:', err);
        setError('Failed to load press articles');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'english') return !article.language || article.language === 'English';
    if (activeFilter === 'chinese') return article.language === 'Chinese';
    return true;
  });

  if (loading) {
    return (
      <section className="flex flex-col items-center px-14 pt-16 pb-16 w-full bg-gray-50 border-t border-solid border-t-neutral-300 max-md:px-5 max-md:pb-24 is-full-width-content">
        <div className="flex flex-col w-full max-w-[1080px]">
          <div className="text-center">Loading press articles...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center px-14 pt-16 pb-16 w-full bg-gray-50 border-t border-solid border-t-neutral-300 max-md:px-5 max-md:pb-24 is-full-width-content">
        <div className="flex flex-col w-full max-w-[1080px]">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center px-14 pt-16 pb-16 w-full bg-gray-50 border-t border-solid border-t-neutral-300 max-md:px-5 max-md:pb-24 is-full-width-content">
      <div className="flex flex-col w-full max-w-[1080px]">
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 border border-solid transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
            }`}
          >
            {filterLabels.all}
          </button>
          <button
            onClick={() => setActiveFilter('english')}
            className={`px-6 py-2 border border-solid transition-all duration-300 ${
              activeFilter === 'english'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
            }`}
          >
            {filterLabels.english}
          </button>
          <button
            onClick={() => setActiveFilter('chinese')}
            className={`px-6 py-2 border border-solid transition-all duration-300 ${
              activeFilter === 'chinese'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
            }`}
          >
            {filterLabels.chinese}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-16 w-full max-md:mt-10 justify-items-center">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => <ArticleCard key={index} {...article} />)
          ) : (
            <div className="col-span-full text-center">No articles available</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArticleGrid;
