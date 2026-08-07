import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getPageBySlug } from '../lib/sanity';
import PageBuilder from './pageBuilder/PageBuilder';

// Renders editor-composed Sanity pages (studio schema: page.js) at /<slug>.
// Registered as the catch-all route in src/index.js, so it also owns the
// not-found state for URLs that match no page document.
function DynamicPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    async function fetchPage() {
      setStatus('loading');
      const data = await getPageBySlug(slug, language);
      if (cancelled) return;
      setPage(data);
      setStatus(data ? 'ready' : 'notFound');
    }
    fetchPage();
    return () => {
      cancelled = true;
    };
  }, [slug, language]);

  useEffect(() => {
    if (page?.title) {
      document.title = `${page.title} | FIREWALL Cafe`;
    }
  }, [page]);

  if (status === 'loading') {
    return (
      <main className="flex flex-col items-center justify-center bg-white w-full min-h-[50vh] is-full-width-content">
        <p className="text-[17px] text-gray-500">Loading...</p>
      </main>
    );
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
