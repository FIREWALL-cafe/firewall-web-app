import { urlFor } from '../../lib/sanity';

function ImageBlock({ image, caption }) {
  if (!image?.asset) return null;
  return (
    <figure className="flex flex-col gap-2 w-full max-w-[720px] px-8 pb-[60px]">
      <img
        src={urlFor(image).width(1440).url()}
        alt={image.alt || caption || ''}
        className="w-full h-auto object-cover"
      />
      {caption && (
        <figcaption className="text-[14px] leading-[1.5] text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default ImageBlock;
