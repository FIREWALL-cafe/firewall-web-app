import React, { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { useLanguage } from '../context/LanguageContext';
import { getVideoPage, urlFor } from '../lib/sanity';
import { parseVimeoId, buildVimeoEmbedSrc } from '../utils/vimeo';

const bodyTextComponents = {
  block: {
    normal: ({ children }) => <p className="max-w-[800px] text-xl leading-9">{children}</p>,
  },
};

// Full-video page (/film). Content is the Sanity `videoPage` singleton: a
// Sanity-hosted video file played natively, or a Vimeo embed as fallback.
function FilmPage() {
  const { language } = useLanguage();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getVideoPage(language)
      .then((data) => {
        if (!cancelled) setPage(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  if (loading) return null;

  const vimeoId = page?.videoUrl ? null : parseVimeoId(page?.vimeoUrl);
  const posterUrl = page?.posterImage ? urlFor(page.posterImage).width(1280).url() : undefined;

  if (!page || (!page.videoUrl && !vimeoId)) {
    return (
      <section className="flex w-full flex-col items-center py-24">
        <p className="text-xl text-neutral-600">
          {language === 'zh' ? '视频暂不可用。' : 'The film is not available yet.'}
        </p>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col items-center py-16 max-md:py-12">
      <div className="flex w-full max-w-[1080px] flex-col items-center gap-5 px-2 md:px-4">
        {(page.heading || page.headingZh) && (
          <div className="font-bitmap-song text-center">
            {page.heading && <h1 className="font-display-04 mb-2">{page.heading}</h1>}
            {page.headingZh && <div className="font-display-04 text-red-600">{page.headingZh}</div>}
          </div>
        )}

        {page.videoUrl ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={posterUrl}
            className="aspect-video w-full rounded-lg bg-black"
            aria-label={page.heading || 'Film'}
          >
            <source src={page.videoUrl} type={page.videoMimeType || undefined} />
          </video>
        ) : (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              src={buildVimeoEmbedSrc(vimeoId, { autoplay: false })}
              title={page.heading || 'Film'}
              className="h-full w-full"
              frameBorder="0"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {page.caption && (
          <p className="text-sm text-neutral-600 leading-snug text-center">{page.caption}</p>
        )}
        {Array.isArray(page.bodyText) && page.bodyText.length > 0 && (
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <PortableText value={page.bodyText} components={bodyTextComponents} />
          </div>
        )}
      </div>
    </section>
  );
}

export default FilmPage;
