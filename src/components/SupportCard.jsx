import React from 'react';

function SupportCard({
  title,
  titleChinese,
  description,
  bgColor,
  textColor,
  iconSrc,
  borderColor,
}) {
  return (
    <div
      className={`flex flex-col flex-1 shrink justify-center items-center self-stretch px-8 my-auto ${bgColor} rounded aspect-square basis-0 min-h-[400px] min-w-[240px] max-md:px-5 ${
        borderColor ? `border border-solid ${borderColor}` : ''
      }`}
    >
      <div className="flex flex-col flex-1 justify-between w-full">
        <div className="flex flex-col w-full">
          <div className="flex gap-2 items-start w-full">
            <h2
              className={`flex-1 shrink gap-2.5 self-stretch text-3xl md:text-4xl lg:text-[48px] leading-10 ${textColor} min-w-[240px]`}
            >
              {title}
            </h2>
            <div className="flex flex-col items-center min-h-[52px] w-[52px]">
              <img
                loading="lazy"
                src={iconSrc}
                className="object-contain aspect-square w-[52px]"
                alt=""
              />
            </div>
          </div>
          <h3 className="chinese text-4xl font-medium leading-none text-red-600">{titleChinese}</h3>
        </div>
        <p className={`mt-28 text-xl leading-8 ${textColor} max-md:mt-10`}>{description}</p>
      </div>
    </div>
  );
}

export default SupportCard;
