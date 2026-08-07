import HeroBlock from './HeroBlock';
import RichTextBlock from './RichTextBlock';
import ImageBlock from './ImageBlock';
import CtaBlock from './CtaBlock';

// Maps Sanity page-builder block types (studio/schemas/blocks/) to components.
const blockComponents = {
  heroBlock: HeroBlock,
  richTextBlock: RichTextBlock,
  imageBlock: ImageBlock,
  ctaBlock: CtaBlock,
};

function PageBuilder({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <>
      {blocks.map((block) => {
        const BlockComponent = blockComponents[block._type];
        if (!BlockComponent) {
          // Fail loudly in development; render nothing in production
          if (process.env.NODE_ENV !== 'production') {
            return (
              <div key={block._key} className="w-full max-w-[720px] px-8 pb-[60px]">
                <p className="border border-red-600 text-red-600 p-4 text-[14px]">
                  Block not found: {block._type}
                </p>
              </div>
            );
          }
          return null;
        }
        return <BlockComponent key={block._key} {...block} />;
      })}
    </>
  );
}

export default PageBuilder;
