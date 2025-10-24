import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedEvents, getLocalizedPartners } from '../lib/sanity';
import LanguageSwitcher from './LanguageSwitcher';

function LocalizationTest() {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [eventsData, partnersData] = await Promise.all([
          getLocalizedEvents(language),
          getLocalizedPartners(language),
        ]);
        setEvents(eventsData);
        setPartners(partnersData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch localized content:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading localized content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header with Language Switcher */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {language === 'en' ? 'Localization Proof of Concept' : '本地化概念验证'}
        </h1>
        <LanguageSwitcher />
      </div>

      {/* Description */}
      <div className="mb-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          {language === 'en' ? 'About This Demo' : '关于此演示'}
        </h2>
        <p className="text-gray-700">
          {language === 'en'
            ? 'This page demonstrates field-level localization with Sanity CMS. Switch between English and Chinese to see the content change dynamically. The localized content includes event titles, descriptions, and partner information.'
            : '此页面演示了 Sanity CMS 的字段级本地化。在英语和中文之间切换以查看内容动态变化。本地化内容包括活动标题、描述和合作伙伴信息。'}
        </p>
      </div>

      {/* Events Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">
          {language === 'en' ? 'Localized Events' : '本地化活动'}
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-600">
            {language === 'en' ? 'No localized events found.' : '未找到本地化活动。'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event._id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3">{event.date}</p>
                {event.location && (
                  <p className="text-gray-700 mb-3">
                    📍 {event.location.name}
                  </p>
                )}
                {event.description && event.description.length > 0 && (
                  <div className="text-gray-700 space-y-2">
                    {event.description.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {event.images && event.images.length > 0 && (
                  <div className="mt-4">
                    <img
                      src={event.images[0].src}
                      alt={event.images[0].alt}
                      className="w-full h-48 object-cover rounded"
                    />
                    {event.images[0].caption && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        {event.images[0].caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Partners Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">
          {language === 'en' ? 'Localized Partners' : '本地化合作伙伴'}
        </h2>
        {partners.length === 0 ? (
          <p className="text-gray-600">
            {language === 'en' ? 'No localized partners found.' : '未找到本地化合作伙伴。'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((partner) => (
              <div key={partner._id} className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {partner.name}
                  </a>
                </h3>
                <p className="text-gray-700">{partner.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Technical Notes */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          {language === 'en' ? 'Technical Implementation' : '技术实施'}
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            {language === 'en'
              ? 'Uses field-level localization with custom locale types'
              : '使用自定义区域设置类型的字段级本地化'}
          </li>
          <li>
            {language === 'en'
              ? 'GROQ queries with coalesce() for fallback to English'
              : 'GROQ 查询使用 coalesce() 回退到英语'}
          </li>
          <li>
            {language === 'en'
              ? 'React Context API for language state management'
              : 'React Context API 用于语言状态管理'}
          </li>
          <li>
            {language === 'en'
              ? 'Language preference saved in localStorage'
              : '语言偏好保存在 localStorage 中'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LocalizationTest;
