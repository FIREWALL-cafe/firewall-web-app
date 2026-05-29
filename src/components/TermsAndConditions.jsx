import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTermsPageStrings } from '../lib/sanity';

const TERMS_BODY = `By entering FIREWALL, you agree to these Terms and the Privacy Policy.

FIREWALL is an experimental interface. It does not produce, filter, or verify the content encountered through it. What appears during a session originates elsewhere.

Your navigation is self-directed. You are responsible for how you engage with the material you access.

FIREWALL is not responsible for the content, availability, or practices of external sites. To the fullest extent permitted by law, FIREWALL disclaims liability for any loss or harm arising from use of the platform or from interactions beyond it.

You agree not to use FIREWALL for unlawful or harmful activity, including interference with systems or misuse of data.

These Terms may change over time. Continued use indicates acceptance.`;

const FALLBACK_SECTIONS = [
  { sectionHeading: '', sectionBody: TERMS_BODY },
];

function TermsAndConditions() {
  const { language } = useLanguage();
  const [strings, setStrings] = useState({
    pageHeading: 'Terms and Conditions',
    pageHeadingZh: '条款和条件',
    sections: FALLBACK_SECTIONS,
  });

  useEffect(() => {
    async function fetchStrings() {
      try {
        const data = await getTermsPageStrings(language);
        if (data) {
          setStrings({
            pageHeading: data.pageHeading || 'Terms and Conditions',
            pageHeadingZh: data.pageHeadingZh || '条款和条件',
            sections: data.sections?.length ? data.sections : FALLBACK_SECTIONS,
          });
        }
      } catch (_) {}
    }
    fetchStrings();
  }, [language]);

  return (
    <main className="flex flex-col items-center bg-white w-full is-full-width-content">
      {/* Page heading */}
      <div className="flex flex-col items-center justify-center pt-[120px] pb-[80px] w-full px-8">
        <div className="font-bitmap-song text-center">
          <h1 className="font-display-01 leading-tight tracking-[2.16px] text-black">
            {strings.pageHeading}
          </h1>
          <div className="font-display-01 leading-tight tracking-[2.16px] text-red-600">
            {strings.pageHeadingZh}
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="flex flex-col gap-[60px] items-start w-full max-w-[720px] px-8 pb-[120px]">
        {strings.sections.map((section, index) => (
          <React.Fragment key={index}>
            {index > 0 && <hr className="w-full border-t border-[#b9c0c7]" />}
            <div className="flex flex-col gap-6 w-full">
              {section.sectionHeading ? (
                <h2 className="font-bold text-[22px] leading-[1.5] text-black">
                  {section.sectionHeading}
                </h2>
              ) : null}
              <p className="text-[17px] leading-[1.5] text-black whitespace-pre-line">
                {section.sectionBody}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}

export default TermsAndConditions;
