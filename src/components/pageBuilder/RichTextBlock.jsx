import { PortableText } from '@portabletext/react';

// Body text uses the site's content-page prose register (text-xl leading-9,
// as on About / Experts / video sections); in-article headings use the
// bitmap-song sizes established by EditorialArticle.jsx.
const components = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-8 mb-4 font-bitmap-song leading-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-6 mb-3 font-bitmap-song leading-tight">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 leading-tight">{children}</h4>
    ),
    normal: ({ children }) => <p className="text-xl leading-9 mb-6">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red-600 pl-4 italic my-6 text-xl leading-9 text-neutral-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-xl leading-9">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-xl leading-9">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-600 hover:text-red-700 underline transition-colors"
      >
        {children}
      </a>
    ),
  },
};

function RichTextBlock({ content }) {
  if (!content?.length) return null;
  return (
    <section className="w-full max-w-[720px] px-8 pb-[60px] text-neutral-900">
      <PortableText value={content} components={components} />
    </section>
  );
}

export default RichTextBlock;
