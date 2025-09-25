import React from 'react';

import FeatureCard from './FeatureCard';

function FeatureCards({ features }) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-8 md:py-16">
      <div
        className={`grid grid-cols-1 gap-6 ${
          features.length > 2 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
        }`}
      >
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}

export default FeatureCards;
