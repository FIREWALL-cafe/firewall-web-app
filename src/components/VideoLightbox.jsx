import React, { useEffect, useRef, useCallback } from 'react';
import { buildVimeoEmbedSrc } from '../utils/vimeo';
import CloseX from '../assets/icons/close.svg';

// Accessible click-to-play lightbox. The Vimeo iframe is only rendered while
// the lightbox is open, so the player never loads until the user opts in.
function VideoLightbox({ open, onClose, vimeoId, title = 'Video', closeLabel = 'Close' }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocused = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      // Simple focus trap: keep Tab focus inside the dialog.
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    // Lock background scroll while the lightbox is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog.
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      // Restore focus to the element that opened the lightbox.
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [open]);

  if (!open || !vimeoId) return null;

  const src = buildVimeoEmbedSrc(vimeoId);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-[1080px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute -top-10 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white md:-right-10 md:-top-2"
        >
          <img src={CloseX} alt="" className="h-6 w-6 invert" />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
          <iframe
            src={src}
            title={title}
            className="h-full w-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default VideoLightbox;
