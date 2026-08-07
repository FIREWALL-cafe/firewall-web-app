import { Link } from 'react-router-dom';

// `variant` comes from the studio schema (ctaBlock.js): 'standard' | 'highlight'.
function CtaBlock({ heading, body, buttonText, url, variant }) {
  const isInternal = url?.startsWith('/');
  const highlight = variant === 'highlight';

  const buttonClasses = highlight
    ? 'inline-block bg-white text-red-600 font-bold px-8 py-3 hover:bg-gray-100'
    : 'inline-block bg-black text-white font-bold px-8 py-3 hover:bg-gray-800';

  const button = isInternal ? (
    <Link to={url} className={buttonClasses}>
      {buttonText}
    </Link>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer" className={buttonClasses}>
      {buttonText}
    </a>
  );

  return (
    <section
      className={`flex flex-col items-center gap-4 w-full px-8 py-[60px] text-center ${
        highlight ? 'bg-red-600' : 'bg-gray-100'
      }`}
    >
      {heading && (
        <h2 className={`font-bold text-[24px] leading-[1.3] ${highlight ? 'text-white' : 'text-black'}`}>
          {heading}
        </h2>
      )}
      {body && (
        <p className={`text-[17px] leading-[1.5] max-w-[560px] whitespace-pre-line ${highlight ? 'text-white' : 'text-gray-700'}`}>
          {body}
        </p>
      )}
      {url && buttonText && button}
    </section>
  );
}

export default CtaBlock;
