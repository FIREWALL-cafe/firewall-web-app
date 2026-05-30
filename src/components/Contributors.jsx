import React, { useState, useEffect } from 'react';
import { getContributors, urlFor } from '../lib/sanity';

import Dan from '../assets/images/dphiffer_bw-300x300.jpg';
import Rowan from '../assets/images/2020-January-06_croppedBW-1-450x384.jpg';
import Silas from '../assets/images/silas-450x450.jpg';
import Rachel from '../assets/images/Rachel1024-450x450.jpg';

const fallbackContributors = [
  {
    name: 'Dan Phiffer',
    role: 'Lead Developer',
    url: 'https://phiffer.org/',
    image: Dan,
    bio: 'Dan Phiffer is an artist, programmer, and researcher working on projects that use computer networks as a raw material. His projects have been exhibited at the Museum of Modern Art, MoMA PS1, SFMOMA, Ars Electronica, and Transmediale and was a 2015-2017 resident at Eyebeam Art + Tech.',
  },
  {
    name: 'Rowan Copley',
    role: 'Developer',
    url: 'https://rowan.earth/',
    image: Rowan,
    bio: 'Rowan builds data systems that help scientists, journalists, and artists quantify the world. He is the lead engineer at a medical diagnostics lab.',
  },
  {
    name: 'Silas Cutler',
    role: 'Developer',
    url: 'https://silascutler.com/',
    image: Silas,
    bio: 'Silas Cutler is a security researcher and programmer with a focus on protecting human rights in the digital age.',
  },
  {
    name: 'Rachel Nackman',
    role: 'Developer',
    url: 'http://www.rachelnackman.com/',
    image: Rachel,
    bio: 'Rachel Nackman is a Brooklyn-based software developer and independent curator. Previously a developer on the digital team at Cooper Hewitt, Smithsonian Design Museum, Rachel is now working as as Software Engineer at Betterment. She has a Master degrees in computer science and art history.',
  },
];

function Contributors() {
  const [contributors, setContributors] = useState(fallbackContributors);

  useEffect(() => {
    async function loadContributors() {
      try {
        const data = await getContributors();
        if (data && data.length > 0) {
          setContributors(data);
        }
      } catch (error) {
        console.error('Failed to load contributors:', error);
      }
    }

    loadContributors();
  }, []);

  function getImageSrc(contributor) {
    if (contributor.headshot?.asset) {
      return urlFor(contributor.headshot).width(600).height(600).url();
    }
    return contributor.image;
  }

  return (
    <section className="flex overflow-hidden justify-center items-start px-2 md:px-4 pb-12 w-full bg-white max-md:pb-16 max-md:max-w-full">
      <div className="flex flex-wrap flex-1 shrink gap-10 justify-center w-full basis-0 min-w-[240px] max-md:max-w-full">
        <div className="flex flex-col flex-1 shrink my-auto text-2xl basis-0 min-w-[240px] max-md:max-w-full">
          <div className="font-display-01 font-bitmap-song ipad-portrait:font-display-03 flex flex-col items-center text-center">
            <h2 className="leading-tight tracking-[2.16px]">Contributors</h2>
            <div className="mt-2 leading-tight text-red-600 tracking-[2.16px]">贡献者</div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {contributors.map((contributor, index) => (
              <div key={contributor._id || index} className="flex flex-col gap-1 border border-black h-[400px] overflow-hidden">
                {contributor.url ? (
                  <a
                    href={contributor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <img
                      src={getImageSrc(contributor)}
                      alt={contributor.name}
                      className="w-full h-[200px] object-cover"
                    />
                  </a>
                ) : (
                  <div className="flex-shrink-0">
                    <img
                      src={getImageSrc(contributor)}
                      alt={contributor.name}
                      className="w-full h-[200px] object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-grow p-4">
                  <h3 className="font-body-01 mb-1">
                    {contributor.url ? (
                      <a href={contributor.url} target="_blank" rel="noopener noreferrer">
                        {contributor.name}
                      </a>
                    ) : (
                      contributor.name
                    )}
                  </h3>
                  <i className="font-body-03 mb-3">{contributor.role}</i>
                  <p className="font-body-04 line-clamp-4 overflow-hidden">{contributor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contributors;
