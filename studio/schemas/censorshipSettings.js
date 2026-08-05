import {defineType} from 'sanity'

// Singleton — the state-media/government domain list for censorship detection.
// A non-empty list here REPLACES the built-in defaults in src/lib/stateMedia.js,
// giving editors full control without a code deploy. An empty list falls back
// to the built-in defaults (safety net against accidental clearing).
export default defineType({
  name: 'censorshipSettings',
  title: 'Censorship Settings',
  type: 'document',

  fields: [
    {
      name: 'stateMediaDomains',
      title: 'State-Media Domains',
      type: 'array',
      description:
        'Hostnames of Chinese state-media or government websites, e.g. "cntv.cn". ' +
        'Matched by suffix, so "example.cn" also covers every subdomain like "news.example.cn". ' +
        'This list is THE list used by the site — adding and removing entries here takes effect ' +
        'within ~10 minutes, no code deploy needed. If the list is left completely empty, the ' +
        'site falls back to a built-in default list.',
      of: [
        {
          type: 'string',
          validation: (Rule) =>
            Rule.custom((value) => {
              if (!value) return 'Domain is required'
              if (/^https?:\/\//i.test(value)) return 'Enter just the hostname, without http(s)://'
              if (/[\s/]/.test(value)) return 'Enter just the hostname, without paths or spaces'
              if (value !== value.toLowerCase()) return 'Use lowercase'
              return true
            }),
        },
      ],
    },
  ],

  preview: {
    prepare() {
      return {title: 'Censorship Settings'}
    },
  },
})
