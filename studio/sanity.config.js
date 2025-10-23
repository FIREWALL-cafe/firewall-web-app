import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Firewall Cafe',

  projectId: '6i3e0mnh',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  // Custom document actions
  document: {
    actions: (prev, context) => {
      // You can customize actions here
      return prev
    },
  },

  // Custom desk structure (optional)
  // Uncomment to customize the Studio sidebar
  /*
  deskTool: {
    structure: (S) =>
      S.list()
        .title('Content')
        .items([
          S.listItem()
            .title('Events')
            .icon(() => '📅')
            .child(
              S.documentTypeList('event')
                .title('All Events')
            ),
          S.divider(),
          S.listItem()
            .title('Press')
            .icon(() => '📰')
            .child(
              S.documentTypeList('pressArticle')
                .title('Press Articles')
            ),
          S.divider(),
          S.listItem()
            .title('Partners')
            .icon(() => '🤝')
            .child(
              S.documentTypeList('partner')
                .title('All Partners')
            ),
        ])
  }
  */
})
