import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getEditorialArticles, getVideoEmbeds, urlFor } from '../lib/sanity';
import { parseVimeoId } from '../utils/vimeo';
import ArticleCard from './ArticleCard';
import VideoLightbox from './VideoLightbox';
import ExpertCommentary from '../assets/icons/expert-commentary.png';
import ExpertCommentaryGrayscale from '../assets/icons/expert-commentary_grayscale.png';

function ExpertArticles({ heading, noArticlesMessage }) {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posters, setPosters] = useState({}); // vimeoId -> thumbnail url (oembed fallback)
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Editorial videos (the trailer) appear as cards alongside the articles.
        const [articleData, videoData] = await Promise.all([
          getEditorialArticles(),
          getVideoEmbeds('editorial', language),
        ]);
        if (cancelled) return;

        // Exclude the featured article so it isn't duplicated by FeaturedEditorial
        setArticles((articleData || []).filter((a) => !a.featured));
        setLoadFailed(false);

        const withIds = (videoData || [])
          .map((v) => ({ ...v, vimeoId: parseVimeoId(v.vimeoUrl) }))
          .filter((v) => v.vimeoId);
        setVideos(withIds);

        // Fetch Vimeo thumbnails for videos without a CMS poster override.
        const needsPoster = withIds.filter((v) => !v.posterImage);
        await Promise.all(
          needsPoster.map(async (v) => {
            try {
              const res = await fetch(`/vimeo-oembed?id=${v.vimeoId}`);
              if (!res.ok) return;
              const json = await res.json();
              if (!cancelled && json.thumbnailUrl) {
                setPosters((prev) => ({ ...prev, [v.vimeoId]: json.thumbnailUrl }));
              }
            } catch (_) {
              /* poster is optional; ignore */
            }
          }),
        );
      } catch (_) {
        if (!cancelled) {
          setArticles([]);
          setVideos([]);
          setLoadFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [language]);

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
          {!loading && articles.length === 0 && videos.length === 0 ? (
            <div className="col-span-full text-center">
              {loadFailed
                ? language === 'zh'
                  ? '无法加载文章，请刷新重试。'
                  : 'Unable to load articles — please refresh to try again.'
                : noArticlesMessage || 'No articles available'}
            </div>
          ) : (
            <>
              {videos.map((video) => (
                <ArticleCard
                  key={video._id}
                  title={(language === 'zh' && video.headingZh) || video.heading || 'Video'}
                  date=""
                  tag={{ text: language === 'zh' ? '视频' : 'Video' }}
                  image={
                    video.posterImage?.asset
                      ? urlFor(video.posterImage).width(512).url()
                      : posters[video.vimeoId] || ExpertCommentaryGrayscale
                  }
                  imageHover={
                    video.posterImage?.asset
                      ? urlFor(video.posterImage).width(512).url()
                      : posters[video.vimeoId] || ExpertCommentary
                  }
                  onActivate={() => setOpenId(video.vimeoId)}
                />
              ))}
              {articles.map((article) => (
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
              ))}
            </>
          )}
        </div>
      </div>
      <VideoLightbox
        open={videos.some((v) => v.vimeoId === openId)}
        onClose={() => setOpenId(null)}
        vimeoId={openId}
        title={videos.find((v) => v.vimeoId === openId)?.heading || 'Video'}
        closeLabel={language === 'zh' ? '关闭' : 'Close'}
      />
    </section>
  );
}

export default ExpertArticles;
