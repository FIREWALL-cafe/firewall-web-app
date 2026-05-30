import {defineType} from 'sanity'

export default defineType({
  name: 'featureCard',
  title: 'Feature Card',
  type: 'document',
  description: 'Reusable feature cards that can be displayed on different pages',

  fields: [
    {
      name: 'title',
      title: 'Card Title',
      type: 'localeString',
      description: 'Heading text for the feature card',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Card Description',
      type: 'localeText',
      description: 'Body text describing the feature',
    },
    {
      name: 'url',
      title: 'Card Link URL',
      type: 'string',
      description: 'Destination URL when card is clicked (e.g., "/search", "/archive")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'iconSrc',
      title: 'Default Icon Path',
      type: 'string',
      description:
        'Reference path to the default icon (e.g., "search-icon.svg"). Should match files in src/assets/icons/',
    },
    {
      name: 'iconSrcHover',
      title: 'Hover Icon Path',
      type: 'string',
      description:
        'Reference path to the hover state icon (e.g., "search-icon-hover.svg"). Should match files in src/assets/icons/',
    },
    {
      name: 'bgColor',
      title: 'Background Color Class',
      type: 'string',
      description: 'Tailwind CSS background color class (e.g., "bg-blue-500", "bg-red-100")',
      options: {
        list: [
          {title: 'Blue 100', value: 'bg-blue-100'},
          {title: 'Blue 500', value: 'bg-blue-500'},
          {title: 'Red 100', value: 'bg-red-100'},
          {title: 'Red 500', value: 'bg-red-500'},
          {title: 'Yellow 100', value: 'bg-yellow-100'},
          {title: 'Yellow 500', value: 'bg-yellow-500'},
          {title: 'Green 100', value: 'bg-green-100'},
          {title: 'Green 500', value: 'bg-green-500'},
          {title: 'Gray 100', value: 'bg-gray-100'},
          {title: 'Gray 500', value: 'bg-gray-500'},
          {title: 'White', value: 'bg-white'},
          {title: 'Black', value: 'bg-black'},
        ],
      },
    },
    {
      name: 'textColor',
      title: 'Text Color Class',
      type: 'string',
      description: 'Tailwind CSS text color class (e.g., "text-white", "text-gray-900")',
      options: {
        list: [
          {title: 'White', value: 'text-white'},
          {title: 'Black', value: 'text-black'},
          {title: 'Gray 900', value: 'text-gray-900'},
          {title: 'Gray 700', value: 'text-gray-700'},
          {title: 'Gray 500', value: 'text-gray-500'},
          {title: 'Blue 500', value: 'text-blue-500'},
          {title: 'Blue 700', value: 'text-blue-700'},
          {title: 'Red 500', value: 'text-red-500'},
          {title: 'Red 700', value: 'text-red-700'},
        ],
      },
    },
    {
      name: 'borderColor',
      title: 'Border Color Class',
      type: 'string',
      description: 'Tailwind CSS border color class (e.g., "border-blue-500", "border-gray-300")',
      options: {
        list: [
          {title: 'Blue 500', value: 'border-blue-500'},
          {title: 'Red 500', value: 'border-red-500'},
          {title: 'Yellow 500', value: 'border-yellow-500'},
          {title: 'Green 500', value: 'border-green-500'},
          {title: 'Gray 300', value: 'border-gray-300'},
          {title: 'Gray 500', value: 'border-gray-500'},
          {title: 'Gray 700', value: 'border-gray-700'},
          {title: 'White', value: 'border-white'},
          {title: 'Black', value: 'border-black'},
          {title: 'Transparent', value: 'border-transparent'},
        ],
      },
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Sort order for displaying cards (lower numbers appear first)',
      validation: (Rule) => Rule.required().integer().min(0),
    },
    {
      name: 'visibleOn',
      title: 'Visible On Pages',
      type: 'array',
      description: 'Select which pages should display this card',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Homepage', value: 'homepage'},
          {title: 'Archive Page', value: 'archive'},
          {title: 'Search Page', value: 'search'},
          {title: 'Editorial Page', value: 'editorial'},
          {title: 'Events Page', value: 'events'},
          {title: 'Support Page', value: 'support'},
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    },
  ],

  preview: {
    select: {
      titleEn: 'title.en',
      titleZh: 'title.zh',
      url: 'url',
      displayOrder: 'displayOrder',
      visibleOn: 'visibleOn',
    },
    prepare({titleEn, titleZh, url, displayOrder, visibleOn}) {
      const pages = visibleOn ? visibleOn.join(', ') : 'none'
      return {
        title: `${titleEn || '?'} / ${titleZh || '?'}`,
        subtitle: `Order: ${displayOrder} | ${url} | Pages: ${pages}`,
      }
    },
  },
})
