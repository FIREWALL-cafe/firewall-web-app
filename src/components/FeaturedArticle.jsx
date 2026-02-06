import React from 'react';

import PressPost from '../assets/images/press-washington_post.jpg';

function FeaturedArticle() {
  return (
    <section className="flex overflow-hidden justify-center items-start pb-16 w-full bg-white max-md:pb-24 is-medium-width-content">
      <div className="flex flex-col lg:flex-row gap-10 justify-center w-full">
        <div className="flex flex-col lg:flex-1 justify-center items-center lg:order-2">
          <img
            src={PressPost}
            alt="Featured article illustration"
            className="object-contain max-w-full aspect-[1.47]"
          />
        </div>
        <div className="flex flex-col lg:flex-1 text-2xl lg:order-1">
          <div className="flex flex-col w-full">
            <div className="font-body-01 text-neutral-600">Featured</div>
            <div className="font-bitmap-song font-display-04 md:font-display-04 flex flex-col mt-10 w-full ">
              <h2 className="">
                How a New York art show about Chinese online censorship found itself censored
              </h2>
              <div className="leading-tight text-red-600 max-md:text-4xl">图表标题</div>
            </div>
            <p className="mt-10 leading-9 text-black">
              On the eve of the event, one of the speakers, a visiting Chinese feminist who had done
              significant work on gender law issues, suddenly started receiving threats.
            </p>
            <a
              href="https://www.washingtonpost.com/news/worldviews/wp/2016/03/11/how-a-new-york-art-show-about-chinese-online-censorship-found-itself-censored/"
              target="_blank"
              className="flex gap-1 justify-center items-center self-start px-4 mt-10 text-xl text-center text-red-600 bg-white rounded border border-red-600 border-solid min-h-[56px]"
              rel="noreferrer"
            >
              <span className="self-stretch my-auto">Read article</span>
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedArticle;
