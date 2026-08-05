import React, { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { useLanguage } from '../context/LanguageContext';
import { getVideoEmbeds, urlFor } from '../lib/sanity';
import { parseVimeoId } from '../utils/vimeo';
import VideoLightbox from './VideoLightbox';

const bodyTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="max-w-[800px] text-xl leading-9">{children}</p>
    ),
  },
};

// Renders all enabled videos for a given page as click-to-play facades.
// `page` matches the videoEmbed `placement` field ('home' | 'editorial').
function VideoEmbedSection({ page }) {
  const { language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [posters, setPosters] = useState({}); // vimeoId -> thumbnail url (oembed fallback)
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getVideoEmbeds(page, language);
        if (cancelled) return;

        const withIds = (data || [])
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
        if (!cancelled) setVideos([]);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, language]);

  if (!videos.length) return null;

  const openVideo = videos.find((v) => v.vimeoId === openId);

  return (
    <section className="flex w-full flex-col items-center py-16 max-md:py-12">
      <div className="flex w-full max-w-[1080px] flex-col gap-16 px-2 md:px-4">
        {videos.map((video) => {
          const posterUrl = video.posterImage
            ? urlFor(video.posterImage).width(1280).url()
            : posters[video.vimeoId];
          const playLabel = video.playButtonLabel || 'Play video';
          const posterAlt = video.posterAlt || '';

          return (
            <div key={video._id} className="flex w-full flex-col items-center gap-5">
              {(video.heading || video.headingZh) && (
                <div className="font-bitmap-song text-center">
                  {video.heading && (
                    <h2 className="font-display-04 mb-2">{video.heading}</h2>
                  )}
                  {video.headingZh && (
                    <div className="font-display-04 text-red-600">{video.headingZh}</div>
                  )}
                </div>
              )}
              {video.description && (
                <p className="max-w-[800px] text-center text-xl leading-9">{video.description}</p>
              )}

              <button
                type="button"
                onClick={() => setOpenId(video.vimeoId)}
                aria-label={playLabel}
                className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                {posterUrl && (
                  <img
                    src={posterUrl}
                    alt={posterAlt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-1 h-8 w-8 fill-black"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
              {video.caption && (
                <p className="text-sm text-neutral-600 leading-snug text-center">{video.caption}</p>
              )}
              {Array.isArray(video.bodyText) && video.bodyText.length > 0 && (
                <div className="flex w-full flex-col items-center gap-4 text-center">
                  <PortableText value={video.bodyText} components={bodyTextComponents} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <VideoLightbox
        open={Boolean(openVideo)}
        onClose={() => setOpenId(null)}
        vimeoId={openVideo?.vimeoId}
        title={openVideo?.heading || 'Video'}
        closeLabel={language === 'zh' ? '关闭' : 'Close'}
      />
    </section>
  );
}

export default VideoEmbedSection;
