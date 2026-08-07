import { PortableText } from '@portabletext/react';

const components = {
  block: {
    normal: ({ children }) => (
      <p className="text-[17px] leading-[1.5] text-black">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-bold text-[22px] leading-[1.5] text-black pt-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-bold text-[18px] leading-[1.5] text-black pt-2">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red-600 pl-4 text-[17px] leading-[1.5] text-gray-700 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-red-600 hover:text-red-700"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 text-[17px] leading-[1.5] text-black flex flex-col gap-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 text-[17px] leading-[1.5] text-black flex flex-col gap-1">{children}</ol>
    ),
  },
};

function RichTextBlock({ content }) {
  if (!content?.length) return null;
  return (
    <section className="flex flex-col gap-4 w-full max-w-[720px] px-8 pb-[60px]">
      <PortableText value={content} components={components} />
    </section>
  );
}

export default RichTextBlock;
