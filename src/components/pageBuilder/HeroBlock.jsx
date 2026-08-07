import { urlFor } from '../../lib/sanity';

function HeroBlock({ heading, tagline, image }) {
  return (
    <section className="flex flex-col items-center w-full px-8 pb-[60px]">
      <div className="w-full max-w-[960px]">
        {image?.asset && (
          <img
            src={urlFor(image).width(1920).url()}
            alt={image.alt || ''}
            className="w-full h-auto object-cover"
          />
        )}
        <div className="flex flex-col gap-3 pt-8 text-center">
          {heading && (
            <h2 className="font-bold text-[28px] leading-[1.3] text-black">
              {heading}
            </h2>
          )}
          {tagline && (
            <p className="text-[17px] leading-[1.5] text-gray-700 whitespace-pre-line">
              {tagline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroBlock;
