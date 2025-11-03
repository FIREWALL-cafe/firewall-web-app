import {defineType} from 'sanity'

export default defineType({
  name: 'footerStrings',
  title: 'Footer Component',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'navLinkAbout',
      title: 'Navigation - About Link',
      type: 'localeString',
      description: 'Footer navigation link text for "About"',
    },
    {
      name: 'navLinkPress',
      title: 'Navigation - Press Link',
      type: 'localeString',
      description: 'Footer navigation link text for "Press"',
    },
    {
      name: 'navLinkEvents',
      title: 'Navigation - Events Link',
      type: 'localeString',
      description: 'Footer navigation link text for "Events"',
    },
    {
      name: 'navLinkSearch',
      title: 'Navigation - Search Link',
      type: 'localeString',
      description: 'Footer navigation link text for "Search"',
    },
    {
      name: 'navLinkArchive',
      title: 'Navigation - Archive Link',
      type: 'localeString',
      description: 'Footer navigation link text for "Search Archive"',
    },
    {
      name: 'navLinkEditorial',
      title: 'Navigation - Editorial Link',
      type: 'localeString',
      description: 'Footer navigation link text for "Expert Commentary"',
    },
    {
      name: 'navLinkPartner',
      title: 'Navigation - Partner Link',
      type: 'localeString',
      description: 'Footer navigation link text for "Partner with us"',
    },
    {
      name: 'navLinkContact',
      title: 'Navigation - Contact Link',
      type: 'localeString',
      description: 'Footer navigation link text for "Contact"',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Footer Component',
        subtitle: 'Manage footer navigation link text (8 fields)',
      }
    },
  },
})
