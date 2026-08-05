import {defineType} from 'sanity'

// Singleton — additional state-media/government domains for censorship detection.
// These are merged with the built-in defaults in src/lib/stateMedia.js; entries
// here extend the list without a code deploy.
export default defineType({
  name: 'censorshipSettings',
  title: 'Censorship Settings',
  type: 'document',

  fields: [
    {
      name: 'stateMediaDomains',
      title: 'Additional State-Media Domains',
      type: 'array',
      description:
        'Hostnames of Chinese state-media or government websites, e.g. "cntv.cn". ' +
        'Matched by suffix, so "example.cn" also covers every subdomain like "news.example.cn". ' +
        'These extend the built-in list (which already includes gov.cn, people.com.cn, cctv.com, etc.); ' +
        'they cannot remove built-in entries.',
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
