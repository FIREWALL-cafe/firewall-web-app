import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getPageBySlug } from '../lib/sanity';
import PageBuilder from './pageBuilder/PageBuilder';

// Stale-while-revalidate cache of published pages, keyed by slug + language.
// Lives for the SPA session; every visit still revalidates in the background,
// so content edits land on the next render pass.
const pageCache = new Map();

// Fast responses (Sanity CDN) usually land before this, so most visitors
// never see a loading state at all.
const SKELETON_DELAY_MS = 250;

function PageSkeleton() {
  return (
    <main
      data-testid="page-skeleton"
      aria-busy="true"
      className="flex flex-col items-center bg-white w-full is-full-width-content"
    >
      <div className="flex flex-col items-center justify-center gap-3 pt-[120px] pb-[80px] w-full px-8">
        <div className="h-10 w-72 max-w-full bg-gray-200 animate-pulse" />
        <div className="h-7 w-44 max-w-full bg-gray-100 animate-pulse" />
      </div>
      <div className="flex flex-col gap-6 w-full max-w-[720px] px-8 pb-[120px]">
        <div className="h-48 w-full bg-gray-100 animate-pulse" />
        <div className="h-4 w-full bg-gray-100 animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-100 animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-100 animate-pulse" />
      </div>
    </main>
  );
}

// Renders editor-composed Sanity pages (studio schema: page.js) at /<slug>.
// Registered as the catch-all route in src/index.js, so it also owns the
// not-found state for URLs that match no page document.
function DynamicPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const cacheKey = `${slug}|${language}`;
  const [page, setPage] = useState(() => pageCache.get(cacheKey) || null);
  const [status, setStatus] = useState(() => (pageCache.get(cacheKey) ? 'ready' : 'loading'));
  const [showSkeleton, setShowSkeleton] = useState(false);
  // Which slug the currently displayed content belongs to — lets a language
  // toggle keep showing the old-language content while the new one loads,
  // without ever showing the previous page after a slug change.
  const displayedSlugRef = useRef(pageCache.get(cacheKey) ? slug : null);

  useEffect(() => {
    let cancelled = false;
    const cached = pageCache.get(cacheKey);

    if (cached) {
      setPage(cached);
      setStatus('ready');
      displayedSlugRef.current = slug;
    } else if (displayedSlugRef.current !== slug) {
      setPage(null);
      setStatus('loading');
    }

    getPageBySlug(slug, language).then((data) => {
      if (cancelled) return;
      if (data) {
        pageCache.set(cacheKey, data);
        setPage(data);
        setStatus('ready');
        displayedSlugRef.current = slug;
      } else {
        // Unpublished/deleted — or a fetch error, which getPageBySlug also
        // reports as null. Drop any stale cache entry and show not-found.
        pageCache.delete(cacheKey);
        setPage(null);
        setStatus('notFound');
        displayedSlugRef.current = null;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, slug, language]);

  const isLoading = status === 'loading';

  useEffect(() => {
    if (!isLoading) {
      setShowSkeleton(false);
      return undefined;
    }
    const timer = setTimeout(() => setShowSkeleton(true), SKELETON_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (page?.title) {
      document.title = `${page.title} | FIREWALL Cafe`;
    }
  }, [page]);

  if (isLoading) {
    if (!showSkeleton) {
      // Blank but full-height, so the footer doesn't jump while we wait out
      // the skeleton delay.
      return <main className="bg-white w-full min-h-[60vh] is-full-width-content" />;
    }
    return <PageSkeleton />;
  }

  if (status === 'notFound') {
    return (
      <main className="flex flex-col items-center bg-white w-full is-full-width-content">
        <div className="flex flex-col items-center justify-center gap-6 pt-[120px] pb-[120px] w-full px-8">
          <div className="font-bitmap-song text-center">
            <h1 className="font-display-01 leading-tight tracking-[2.16px] text-black">
              Page Not Found
            </h1>
            <div className="font-display-01 leading-tight tracking-[2.16px] text-red-600">
              页面未找到
            </div>
          </div>
          <Link to="/" className="underline text-[17px] text-black hover:text-red-600">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center bg-white w-full is-full-width-content">
      {/* Bilingual page heading, matching the site-wide pattern */}
      <div className="flex flex-col items-center justify-center pt-[120px] pb-[80px] w-full px-8">
        <div className="font-bitmap-song text-center">
          <h1 className="font-display-01 leading-tight tracking-[2.16px] text-black">
            {page.title}
          </h1>
          {page.titleZh && (
            <div className="font-display-01 leading-tight tracking-[2.16px] text-red-600">
              {page.titleZh}
            </div>
          )}
        </div>
      </div>

      <PageBuilder blocks={page.pageBuilder} />

      <div className="pb-[60px]" />
    </main>
  );
}

export default DynamicPage;
