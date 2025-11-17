import {defineType} from 'sanity'

export default defineType({
  name: 'siteAssets',
  title: 'Site Assets',
  type: 'document',
  description: 'Manages site-wide images, logos, icons, and UI assets',

  // Singleton: only one document allowed (temporarily allow create for initial setup)
  __experimental_actions: ['create', 'update', 'publish', 'delete'],

  fields: [
    // ========== LOGOS ==========
    {
      name: 'logoFull',
      title: 'Full Logo (with text)',
      type: 'image',
      description: 'Full Firewall Cafe logo with text',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logoIcon',
      title: 'Logo Icon (icon only)',
      type: 'image',
      description: 'Firewall Cafe icon/symbol without text',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },

    // ========== SOCIAL MEDIA ICONS ==========
    {
      name: 'facebookIcon',
      title: 'Facebook Icon',
      type: 'image',
      description: 'Facebook social media icon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'instagramIcon',
      title: 'Instagram Icon',
      type: 'image',
      description: 'Instagram social media icon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'youtubeIcon',
      title: 'YouTube Icon',
      type: 'image',
      description: 'YouTube social media icon',
      validation: (Rule) => Rule.required(),
    },

    // ========== NAVIGATION ICONS ==========
    {
      name: 'menuIcon',
      title: 'Menu Icon (hamburger)',
      type: 'image',
      description: 'Mobile menu icon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'closeIcon',
      title: 'Close Icon',
      type: 'image',
      description: 'Close/dismiss icon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'closeLargeIcon',
      title: 'Close Icon (large)',
      type: 'image',
      description: 'Large close/dismiss icon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'searchIcon',
      title: 'Search Icon',
      type: 'image',
      description: 'Search magnifying glass icon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'locationIcon',
      title: 'Location Icon',
      type: 'image',
      description: 'Location pin icon',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'envelopeIcon',
      title: 'Envelope Icon',
      type: 'image',
      description: 'Email/newsletter envelope icon',
      validation: (Rule) => Rule.required(),
    },

    // ========== PAGE HERO IMAGES ==========
    {
      name: 'aboutHero',
      title: 'About Page Hero Image',
      type: 'image',
      description: 'Hero image for About page',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'supportHero',
      title: 'Support Page Hero Image',
      type: 'image',
      description: 'Hero image for Support page',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'pressIcon',
      title: 'Press Page Icon',
      type: 'image',
      description: 'Icon for Press page hero',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'expertCommentaryIcon',
      title: 'Expert Commentary Icon',
      type: 'image',
      description: 'Icon for Expert Commentary page',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },

    // ========== PEOPLE/ARTIST IMAGES ==========
    {
      name: 'artistHeadshot',
      title: 'Artist Headshot (Joyce Yu-Jean Lee)',
      type: 'image',
      description: 'Headshot photo of artist Joyce Yu-Jean Lee for About page',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },

    // ========== FEATURE/SECTION ICONS (with grayscale variants) ==========
    {
      name: 'archiveIcon',
      title: 'Archive Icon',
      type: 'image',
      description: 'Archive feature icon (color)',
    },
    {
      name: 'archiveIconGrayscale',
      title: 'Archive Icon (grayscale)',
      type: 'image',
      description: 'Archive feature icon (grayscale/inactive)',
    },
    {
      name: 'eventsIcon',
      title: 'Events Icon',
      type: 'image',
      description: 'Events feature icon (color)',
    },
    {
      name: 'eventsIconGrayscale',
      title: 'Events Icon (grayscale)',
      type: 'image',
      description: 'Events feature icon (grayscale/inactive)',
    },
    {
      name: 'pressIconNav',
      title: 'Press Navigation Icon',
      type: 'image',
      description: 'Press feature icon for navigation (color)',
    },
    {
      name: 'pressIconNavGrayscale',
      title: 'Press Navigation Icon (grayscale)',
      type: 'image',
      description: 'Press feature icon (grayscale/inactive)',
    },
    {
      name: 'supportIconNav',
      title: 'Support Navigation Icon',
      type: 'image',
      description: 'Support feature icon (color)',
    },
    {
      name: 'supportIconNavGrayscale',
      title: 'Support Navigation Icon (grayscale)',
      type: 'image',
      description: 'Support feature icon (grayscale/inactive)',
    },
    {
      name: 'donationIcon',
      title: 'Donation Icon',
      type: 'image',
      description: 'Donation feature icon (color)',
    },
    {
      name: 'donationIconGrayscale',
      title: 'Donation Icon (grayscale)',
      type: 'image',
      description: 'Donation feature icon (grayscale/inactive)',
    },
    {
      name: 'sponsorIcon',
      title: 'Sponsor Icon',
      type: 'image',
      description: 'Sponsor feature icon (color)',
    },
    {
      name: 'sponsorIconGrayscale',
      title: 'Sponsor Icon (grayscale)',
      type: 'image',
      description: 'Sponsor feature icon (grayscale/inactive)',
    },
    {
      name: 'statsIcon',
      title: 'Stats Icon',
      type: 'image',
      description: 'Statistics feature icon (color)',
    },
    {
      name: 'statsIconGrayscale',
      title: 'Stats Icon (grayscale)',
      type: 'image',
      description: 'Statistics feature icon (grayscale/inactive)',
    },
    {
      name: 'timelineIcon',
      title: 'Timeline Icon',
      type: 'image',
      description: 'Timeline feature icon (color)',
    },
    {
      name: 'timelineIconGrayscale',
      title: 'Timeline Icon (grayscale)',
      type: 'image',
      description: 'Timeline feature icon (grayscale/inactive)',
    },
    {
      name: 'searchIconColor',
      title: 'Search Feature Icon (color)',
      type: 'image',
      description: 'Search feature icon (color)',
    },
    {
      name: 'searchIconGrayscale',
      title: 'Search Feature Icon (grayscale)',
      type: 'image',
      description: 'Search feature icon (grayscale/inactive)',
    },

    // ========== UI FUNCTIONAL ICONS ==========
    {
      name: 'carouselLeftIcon',
      title: 'Carousel Left Arrow',
      type: 'image',
      description: 'Left navigation arrow for carousels',
    },
    {
      name: 'carouselRightIcon',
      title: 'Carousel Right Arrow',
      type: 'image',
      description: 'Right navigation arrow for carousels',
    },
    {
      name: 'arrowForwardIcon',
      title: 'Arrow Forward',
      type: 'image',
      description: 'Forward arrow icon',
    },
    {
      name: 'arrowLeftAltIcon',
      title: 'Arrow Left (alt)',
      type: 'image',
      description: 'Left arrow icon (alternative)',
    },
    {
      name: 'arrowRightAltIcon',
      title: 'Arrow Right (alt)',
      type: 'image',
      description: 'Right arrow icon (alternative)',
    },
    {
      name: 'keyboardArrowDownIcon',
      title: 'Keyboard Arrow Down',
      type: 'image',
      description: 'Dropdown/expand down arrow',
    },
    {
      name: 'keyboardArrowUpIcon',
      title: 'Keyboard Arrow Up',
      type: 'image',
      description: 'Collapse/up arrow',
    },
    {
      name: 'expandCircleDownIcon',
      title: 'Expand Circle Down',
      type: 'image',
      description: 'Circular expand down icon',
    },
    {
      name: 'expandCircleUpIcon',
      title: 'Expand Circle Up',
      type: 'image',
      description: 'Circular expand up icon',
    },
    {
      name: 'toggleActiveIcon',
      title: 'Toggle (active state)',
      type: 'image',
      description: 'Toggle switch in active/on state',
    },
    {
      name: 'toggleDefaultIcon',
      title: 'Toggle (default state)',
      type: 'image',
      description: 'Toggle switch in default/off state',
    },
    {
      name: 'showMoreDefaultIcon',
      title: 'Show More (default)',
      type: 'image',
      description: 'Show more button default state',
    },
    {
      name: 'showMoreActiveIcon',
      title: 'Show More (active)',
      type: 'image',
      description: 'Show more button active state',
    },
    {
      name: 'tuneIcon',
      title: 'Tune/Filter Icon',
      type: 'image',
      description: 'Filter/settings tune icon',
    },
    {
      name: 'cancelIcon',
      title: 'Cancel Icon',
      type: 'image',
      description: 'Cancel/dismiss icon',
    },
    {
      name: 'calendarMonthIcon',
      title: 'Calendar Month Icon',
      type: 'image',
      description: 'Calendar/date picker icon',
    },
    {
      name: 'scheduleIcon',
      title: 'Schedule Icon',
      type: 'image',
      description: 'Time/schedule icon',
    },
    {
      name: 'folderOpenIcon',
      title: 'Folder Open Icon',
      type: 'image',
      description: 'Open folder icon',
    },
    {
      name: 'folderOpenSearchIcon',
      title: 'Folder Open Search Icon',
      type: 'image',
      description: 'Open folder with search icon',
    },
    {
      name: 'checkIcon',
      title: 'Check Icon',
      type: 'image',
      description: 'Checkmark icon',
    },
    {
      name: 'check2CircleIcon',
      title: 'Check Circle Icon',
      type: 'image',
      description: 'Checkmark in circle icon',
    },
    {
      name: 'thumbUpIcon',
      title: 'Thumb Up Icon',
      type: 'image',
      description: 'Thumbs up icon',
    },
    {
      name: 'thumbDownIcon',
      title: 'Thumb Down Icon',
      type: 'image',
      description: 'Thumbs down icon',
    },
    {
      name: 'visibilityIcon',
      title: 'Visibility Icon',
      type: 'image',
      description: 'Show/visibility eye icon',
    },
    {
      name: 'visibilityOffIcon',
      title: 'Visibility Off Icon',
      type: 'image',
      description: 'Hide/visibility off icon',
    },
    {
      name: 'howToVoteIcon',
      title: 'How to Vote Icon',
      type: 'image',
      description: 'Voting instructions icon',
    },
    {
      name: 'lostInTranslationIcon',
      title: 'Lost in Translation Icon',
      type: 'image',
      description: 'Lost in translation vote icon',
    },
    {
      name: 'questionIcon',
      title: 'Question Icon',
      type: 'image',
      description: 'Question mark icon',
    },
    {
      name: 'questionRedIcon',
      title: 'Question Icon (red)',
      type: 'image',
      description: 'Question mark icon (red)',
    },
    {
      name: 'brightness2Icon',
      title: 'Brightness/Moon Icon',
      type: 'image',
      description: 'Brightness or moon icon',
    },
    {
      name: 'priorityIcon',
      title: 'Priority Icon',
      type: 'image',
      description: 'Priority/important icon',
    },
    {
      name: 'imageSearchIcon',
      title: 'Image Search Icon',
      type: 'image',
      description: 'Image search icon',
    },
    {
      name: 'imagesModeIcon',
      title: 'Images Mode Icon',
      type: 'image',
      description: 'Images mode/gallery icon',
    },
    {
      name: 'fullscreenExitIcon',
      title: 'Fullscreen Exit Icon',
      type: 'image',
      description: 'Exit fullscreen icon',
    },
    {
      name: 'disabledByDefaultIcon',
      title: 'Disabled by Default Icon',
      type: 'image',
      description: 'Disabled/inactive state icon',
    },

    // ========== PLACEHOLDER/ERROR IMAGES ==========
    {
      name: 'brokenImagePlaceholder',
      title: 'Broken Image Placeholder',
      type: 'image',
      description: 'Placeholder for broken/missing images',
    },
    {
      name: 'brokenImagePlaceholderPadding',
      title: 'Broken Image Placeholder (with padding)',
      type: 'image',
      description: 'Placeholder for broken images with padding',
    },
    {
      name: 'brokenImageGrayscale',
      title: 'Broken Image (grayscale)',
      type: 'image',
      description: 'Broken image icon (grayscale)',
    },
    {
      name: 'censoredImagePlaceholder',
      title: 'Censored Image Placeholder',
      type: 'image',
      description: 'Placeholder for censored images',
    },
    {
      name: 'censoredImagePlaceholderPadding',
      title: 'Censored Image Placeholder (with padding)',
      type: 'image',
      description: 'Placeholder for censored images with padding',
    },
    {
      name: 'censoredBrokenImage',
      title: 'Censored Broken Image',
      type: 'image',
      description: 'Censored broken image icon',
    },
    {
      name: 'noImageAvailable',
      title: 'No Image Available',
      type: 'image',
      description: 'No image available placeholder',
    },

    // ========== SEARCH ENGINE LOGOS ==========
    {
      name: 'googleLogoLong',
      title: 'Google Logo (long)',
      type: 'image',
      description: 'Full Google logo',
    },
    {
      name: 'googleLogoBlue',
      title: 'Google Logo (blue)',
      type: 'image',
      description: 'Google logo blue variant',
    },
    {
      name: 'googleLogoRed',
      title: 'Google Logo (red)',
      type: 'image',
      description: 'Google logo red variant',
    },
    {
      name: 'baiduLogoLong',
      title: 'Baidu Logo (long)',
      type: 'image',
      description: 'Full Baidu logo',
    },
    {
      name: 'baiduLogoRed',
      title: 'Baidu Logo (red)',
      type: 'image',
      description: 'Baidu logo red variant',
    },

    // ========== TRANSLATION ICONS ==========
    {
      name: 'translateIcon',
      title: 'Translate Icon',
      type: 'image',
      description: 'Google Translate icon',
    },
    {
      name: 'translateIconBlack',
      title: 'Translate Icon (black)',
      type: 'image',
      description: 'Google Translate icon (black)',
    },

    // ========== MISC ICONS ==========
    {
      name: 'spinnerIcon',
      title: 'Spinner/Loading Icon',
      type: 'image',
      description: 'Loading spinner animation icon',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Site Assets',
        subtitle: 'Logos, icons, and UI images'
      }
    }
  }
})
