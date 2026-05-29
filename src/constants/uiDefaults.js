/**
 * Language-aware UI string defaults
 * Used as fallbacks when Sanity CMS content is unavailable
 * Following Sanity best practice: "Assume nothing exists"
 */

export const UI_DEFAULTS = {
  // Homepage strings
  homepage: {
    en: {
      heroTitleAnimated: 'Search|Compare|Understand',
      aboutMainHeading: 'What is FIREWALL Cafe?',
      aboutMainHeadingZh: '什么是防火墙咖啡馆？',
      aboutIntroParagraph1: '"Just Google it." That phrase has become almost a knee-jerk response whenever we\'re stumped. But does the internet truly have all the answers?',
      aboutIntroParagraph2: 'FIREWALL Cafe is an art project launched in 2016 to shine a light on Google\'s search engine monopoly and China\'s suppression of free speech through Baidu, the primary Chinese search engine.',
      aboutButtonText: 'About',
      aboutButtonAriaLabel: 'About',
      infoCtaHeading: 'Start Exploring',
      infoCtaHeadingZh: '开始探索',
      infoCtaParagraph1: 'The FIREWALL dual-search engine will automatically translate your query, and provide image results from both Google and Baidu. Compare the image results side by side, and vote on whether you believe the results are being censored, manipulated, or lost in translation!',
      infoCtaParagraph2: 'The goal of this art project is to educate the public about internet freedom and censorship.',
      infoCtaButton: 'Start Searching',
      infoCtaButtonAriaLabel: 'Start Searching',
      searchTrendsSectionHeading: 'Search Trends',
      searchTrendsSectionHeadingZh: '搜索趋势',
      newsletterHeading: '保持联系',
      newsletterSubheading: 'Get updates about upcoming events',
      newsletterEmailPlaceholder: 'Email',
      newsletterSubscribeButton: 'Submit',
    },
    zh: {
      heroTitleAnimated: '搜索|比较|理解',
      aboutMainHeading: '什么是防火墙咖啡馆？',
      aboutMainHeadingZh: '你知道什么时候会看到审查制度吗?',
      aboutIntroParagraph1: '「直接谷歌一下」这句话已经成为我们遇到困难时的几乎本能反应。但互联网真的拥有所有答案吗？',
      aboutIntroParagraph2: '防火墙咖啡馆是2016年推出的艺术项目，旨在揭示谷歌搜索引擎的垄断地位以及中国通过百度（主要的中文搜索引擎）对言论自由的压制。',
      aboutButtonText: '关于',
      aboutButtonAriaLabel: '关于',
      infoCtaHeading: '开始探索',
      infoCtaHeadingZh: '越过墙往外看。自己决定。',
      infoCtaParagraph1: '防火墙双搜索引擎将自动翻译您的查询，并提供来自谷歌和百度的图片结果。并排比较图片结果，并投票您认为结果是否被审查、操纵或翻译丢失！',
      infoCtaParagraph2: '这个艺术项目的目标是教育公众关于互联网自由和审查制度。',
      infoCtaButton: '开始搜索',
      infoCtaButtonAriaLabel: '开始搜索',
      searchTrendsSectionHeading: '搜索趋势',
      searchTrendsSectionHeadingZh: '人们翻墙时在寻找什么?',
      newsletterHeading: '保持联系',
      newsletterSubheading: '获取即将举行的活动的更新',
      newsletterEmailPlaceholder: '电子邮件',
      newsletterSubscribeButton: '提交',
    },
  },

  // Search page strings
  search: {
    en: {
      searchInputPlaceholder: 'Search Google + Baidu',
      searchModeTooltip: 'Your query will automatically translate into the other language. English queries will be searched in <b>Google</b>. Chinese queries will be searched in <b>Baidu</b>.',
      translatingText: 'Translating...',
      translationLabel: 'Translation:',
      errorLabel: 'Error:',
      searchSessionHeading: 'Search Session',
      compareButton: 'Search',
      searchComparisonLink: 'Search',
    },
    zh: {
      searchInputPlaceholder: '搜索谷歌和百度',
      searchModeTooltip: '您的查询将自动翻译成另一种语言。英文查询将在<b>谷歌</b>中搜索。中文查询将在<b>百度</b>中搜索。',
      translatingText: '翻译中...',
      translationLabel: '翻译：',
      errorLabel: '错误：',
      searchSessionHeading: '搜索会话',
      compareButton: '搜索',
      searchComparisonLink: '搜索',
    },
  },

  // Archive page strings
  archive: {
    en: {
      archiveInputPlaceholder: 'Search the Archive',
      archiveButton: 'Archive',
      archiveModeTooltip: "Explore the archive to view past results from other users and see how they've changed over time.",
      queryListHeaderVotes: 'Votes',
      queryListHeaderQueryEn: 'Query EN',
      queryListHeaderQueryZh: 'Query ZH',
      queryListHeaderLocation: 'Search Location',
      queryListHeaderDate: 'Date',
      queryListTotalResults: 'Total results',
      queryListNoResults: 'No results found',
      queryListLoadingText: 'Loading...',
      queryListLoadMoreButton: 'load more',
      archiveFiltersButton: 'Filters',
      searchArchiveLink: 'Archive',
    },
    zh: {
      archiveInputPlaceholder: '搜索查询存档',
      archiveButton: '存档',
      searchArchiveLink: '存档',
      archiveModeTooltip: '探索存档以查看其他用户的过去结果并了解它们随时间的变化。',
      queryListHeaderVotes: '投票',
      queryListHeaderQueryEn: '搜索结果 英文',
      queryListHeaderQueryZh: '搜索结果 中文',
      queryListHeaderLocation: '搜索位置',
      queryListHeaderDate: '日期',
      queryListTotalResults: '总结果',
      queryListNoResults: '未找到结果',
      queryListLoadingText: '加载中...',
      queryListLoadMoreButton: '加载更多',
      archiveFiltersButton: '筛选',
    },
  },

  // Vote strings
  vote: {
    en: {
      voteButtonCensored: 'Censored',
      voteButtonUncensored: 'Uncensored',
      voteButtonBadTranslation: 'Bad Translation',
      voteButtonGoodTranslation: 'Good Translation',
      voteButtonLostInTranslation: 'Lost in Translation',
      voteButtonNsfw: 'NSFW',
      voteButtonWtf: 'WTF',
    },
    zh: {
      voteButtonCensored: '已审查',
      voteButtonUncensored: '未审查',
      voteButtonBadTranslation: '翻译不良',
      voteButtonGoodTranslation: '翻译良好',
      voteButtonLostInTranslation: '翻译丢失',
      voteButtonNsfw: '不适合工作',
      voteButtonWtf: '什么鬼',
    },
  },

  // Content pages
  about: {
    en: {
      aboutPageHeading: 'What do we lose in the dark?',
      aboutArtistSectionHeading: 'About Joyce',
    },
    zh: {
      aboutPageHeading: '我们在黑暗中失去了什么？',
      aboutArtistSectionHeading: '关于乔伊斯',
    },
  },

  editorial: {
    en: {
      editorialPageHeading: 'Expert commentary',
    },
    zh: {
      editorialPageHeading: '专家点评',
    },
  },

  press: {
    en: {
      pressPageHeading: 'In the press',
    },
    zh: {
      pressPageHeading: '在新闻界',
    },
  },

  support: {
    en: {
      supportPageHeading: 'Support the frontline of internet freedom advocates',
    },
    zh: {
      supportPageHeading: '支持互联网自由战士的前线',
    },
  },

  contact: {
    en: {
      contactPageHeading: 'Get in touch',
      contactFollowHeading: 'Follow',
    },
    zh: {
      contactPageHeading: '联系我们',
      contactFollowHeading: '跟踪',
    },
  },

  // Footer strings
  footer: {
    en: {
      navLinkAbout: 'About',
      navLinkPress: 'Press',
      navLinkEvents: 'Events',
      navLinkSearch: 'Search',
      navLinkArchive: 'Search Archive',
      navLinkEditorial: 'Expert Commentary',
      navLinkPartner: 'Partner with us',
      navLinkContact: 'Contact',
    },
    zh: {
      navLinkAbout: '关于',
      navLinkPress: '新闻',
      navLinkEvents: '活动',
      navLinkSearch: '搜索',
      navLinkArchive: '搜索存档',
      navLinkEditorial: '专家点评',
      navLinkPartner: '与我们合作',
      navLinkContact: '联系',
    },
  },

  // Navigation strings
  navigation: {
    en: {
      searchPlaceholder: 'Search Google + Baidu',
      newsletterTitle: '订阅我们的通讯',
      newsletterSubtitle: '保持联系',
      menuLinkArchive: 'Query Archive',
      menuLinkEditorial: 'Expert Commentary',
      menuLinkEvents: 'Events',
      menuLinkPress: 'Press',
      menuLinkAbout: 'About',
      menuLinkSupport: 'Support Us',
      menuLinkContact: 'Contact',
    },
    zh: {
      searchPlaceholder: '搜索谷歌和百度',
      newsletterTitle: '订阅我们的通讯',
      newsletterSubtitle: '保持联系',
      menuLinkArchive: '查询存档',
      menuLinkEditorial: '专家点评',
      menuLinkEvents: '活动',
      menuLinkPress: '新闻',
      menuLinkAbout: '关于',
      menuLinkSupport: '支持我们',
      menuLinkContact: '联系',
    },
  },

  // Global/common strings
  global: {
    en: {
      loading: 'Loading...',
      commonLoadingText: 'Loading...',
      error: 'An error occurred',
      tryAgain: 'Try again',
      timeDisplayYourTime: 'Your time:',
      timeDisplayBeijing: 'Beijing:',
      headerUsernameLabel: 'Username:',
    },
    zh: {
      loading: '加载中...',
      commonLoadingText: '加载中...',
      error: '发生错误',
      tryAgain: '再试一次',
      timeDisplayYourTime: '您的时间：',
      timeDisplayBeijing: '北京：',
      headerUsernameLabel: '用户名：',
    },
  },
};

/**
 * Helper function to get language-aware default value
 * @param {string} section - Section name (e.g., 'homepage', 'search')
 * @param {string} key - String key (e.g., 'newsletterHeading')
 * @param {string} lang - Language code ('en' or 'zh')
 * @returns {string} Default value in the requested language
 */
export function getDefault(section, key, lang = 'en') {
  return UI_DEFAULTS[section]?.[lang]?.[key] || UI_DEFAULTS[section]?.en?.[key] || '';
}
