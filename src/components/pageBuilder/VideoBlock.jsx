import { urlFor } from '../../lib/sanity';
import { parseVimeoId, buildVimeoEmbedSrc } from '../../utils/vimeo';

// An uploaded file wins over the Vimeo URL, mirroring FilmPage.
function VideoBlock({ videoUrl, videoMimeType, vimeoUrl, posterImage, caption }) {
  const vimeoId = videoUrl ? null : parseVimeoId(vimeoUrl);
  if (!videoUrl && !vimeoId) return null;

  const posterUrl = posterImage?.asset ? urlFor(posterImage).width(1280).url() : undefined;

  return (
    <figure className="flex flex-col gap-2 w-full max-w-[720px] px-8 pb-[60px]">
      {videoUrl ? (
        <video
          controls
          playsInline
          preload="metadata"
          poster={posterUrl}
          className="aspect-video w-full bg-black"
          aria-label={caption || 'Video'}
        >
          <source src={videoUrl} type={videoMimeType || undefined} />
        </video>
      ) : (
        <div className="aspect-video w-full overflow-hidden bg-black">
          <iframe
            src={buildVimeoEmbedSrc(vimeoId, { autoplay: false })}
            title={caption || 'Video'}
            className="h-full w-full"
            frameBorder="0"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {caption && (
        <figcaption className="text-[14px] leading-[1.5] text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}

export default VideoBlock;
