import {defineType} from 'sanity'

// Editor-composed page. Rendered by the frontend catch-all route
// (src/components/DynamicPage.jsx) at /<slug>. Blocks live in ./blocks/;
// their order here controls the Studio insert-menu order.
export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: () => '🧱',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'localeString',
      description: 'Shown as the bilingual page heading (EN black / 中文 red)',
      validation: (Rule) => Rule.required().custom((value) => (value?.en ? true : 'English title is required')),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path of the page, e.g. "research-residency" → firewallcafe.com/research-residency',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Optional description for search engines and link previews',
    },
    {
      name: 'pageBuilder',
      title: 'Page Content',
      type: 'array',
      description: 'Add, arrange, and reorder the blocks that make up this page',
      of: [
        {type: 'heroBlock'},
        {type: 'richTextBlock'},
        {type: 'imageBlock'},
        {type: 'ctaBlock'},
      ],
      options: {
        insertMenu: {
          views: [{name: 'grid'}, {name: 'list'}],
        },
      },
    },
  ],
  preview: {
    select: {
      titleEn: 'title.en',
      titleZh: 'title.zh',
      slug: 'slug.current',
    },
    prepare({titleEn, titleZh, slug}) {
      return {
        title: `${titleEn || '?'}${titleZh ? ` / ${titleZh}` : ''}`,
        subtitle: slug ? `/${slug}` : 'No slug yet',
      }
    },
  },
})
