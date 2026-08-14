import FeatureCards from '../FeatureCards';
import { featureCardIconMap, defaultFeatureCardIcons } from '../../lib/featureCardIcons';

// Renders referenced featureCard documents through the same FeatureCards/
// FeatureCard components the fixed pages use, with the same prop mapping
// as Search.jsx / SearchArchive.jsx.
function FeatureCardsBlock({ heading, cards }) {
  const features = (cards || [])
    .filter((card) => card?.title)
    .map((card) => ({
      title: card.titleEn || card.title,
      url: card.url,
      chineseTitle: {
        text: card.titleZh || card.title,
        color: card.textColor || 'text-black',
      },
      description: card.description,
      iconSrc: featureCardIconMap[card.iconSrc] || defaultFeatureCardIcons.iconSrc,
      iconSrcHover: featureCardIconMap[card.iconSrcHover] || defaultFeatureCardIcons.iconSrcHover,
      bgColor: card.bgColor,
      textColor: card.textColor,
      borderColor: card.borderColor,
    }));

  if (!features.length) return null;

  return (
    <div className="w-full">
      {heading && (
        <h2 className="font-bitmap-song font-header-02 text-black text-center pt-4">{heading}</h2>
      )}
      <FeatureCards features={features} />
    </div>
  );
}

export default FeatureCardsBlock;
