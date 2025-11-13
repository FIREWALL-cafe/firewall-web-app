export const deskStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Translations section with filters
      S.listItem()
        .title('Translations')
        .icon(() => '🌐')
        .child(
          S.list()
            .title('Translation Management')
            .items([
              // All translations
              S.listItem()
                .title('All Translations')
                .icon(() => '📚')
                .child(
                  S.documentTypeList('translation')
                    .title('All Translations')
                    .filter('_type == "translation"')
                ),

              S.divider(),

              // Sensitive translations (manual, priority)
              S.listItem()
                .title('Sensitive Terms')
                .icon(() => '🔒')
                .child(
                  S.documentList()
                    .title('Sensitive Translations')
                    .filter('_type == "translation" && source == "sensitive"')
                ),

              // Manual overrides
              S.listItem()
                .title('Manual Overrides')
                .icon(() => '✏️')
                .child(
                  S.documentList()
                    .title('Manual Override Translations')
                    .filter('_type == "translation" && source == "override"')
                ),

              // Google cached translations
              S.listItem()
                .title('Google Cached')
                .icon(() => '🔄')
                .child(
                  S.documentList()
                    .title('Google Translate Cache')
                    .filter('_type == "translation" && source == "google"')
                ),

              S.divider(),

              // By language direction
              S.listItem()
                .title('English → Chinese')
                .icon(() => '🇺🇸→🇨🇳')
                .child(
                  S.documentList()
                    .title('EN → ZH Translations')
                    .filter('_type == "translation" && langFrom == "en" && langTo == "zh"')
                ),

              S.listItem()
                .title('Chinese → English')
                .icon(() => '🇨🇳→🇺🇸')
                .child(
                  S.documentList()
                    .title('ZH → EN Translations')
                    .filter('_type == "translation" && langFrom == "zh" && langTo == "en"')
                ),
            ])
        ),

      S.divider(),

      // Events
      S.listItem()
        .title('Events')
        .icon(() => '📅')
        .child(
          S.documentTypeList('event')
            .title('All Events')
        ),

      // Timeline Events
      S.listItem()
        .title('Timeline Events')
        .icon(() => '⏱️')
        .child(
          S.documentTypeList('timelineEvent')
            .title('All Timeline Events')
        ),

      S.divider(),

      // Press
      S.listItem()
        .title('Press')
        .icon(() => '📰')
        .child(
          S.documentTypeList('pressArticle')
            .title('Press Articles')
        ),

      // Partners
      S.listItem()
        .title('Partners')
        .icon(() => '🤝')
        .child(
          S.documentTypeList('partner')
            .title('All Partners')
        ),

      S.divider(),

      // Settings
      S.listItem()
        .title('Settings')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem()
                .title('Navigation Menu')
                .child(
                  S.documentTypeList('navigationSettings')
                    .title('Navigation Settings')
                ),

              S.divider(),

              // UI Strings
              S.listItem()
                .title('UI Strings')
                .icon(() => '💬')
                .child(
                  S.list()
                    .title('UI Text')
                    .items([
                      S.documentTypeListItem('globalStrings').title('Global Strings'),
                      S.documentTypeListItem('homepageStrings').title('Homepage'),
                      S.documentTypeListItem('searchPageStrings').title('Search Page'),
                      S.documentTypeListItem('archivePageStrings').title('Archive Page'),
                      S.documentTypeListItem('aboutPageStrings').title('About Page'),
                      S.documentTypeListItem('editorialPageStrings').title('Editorial Page'),
                      S.documentTypeListItem('pressPageStrings').title('Press Page'),
                      S.documentTypeListItem('supportPageStrings').title('Support Page'),
                      S.documentTypeListItem('contactPageStrings').title('Contact Page'),
                      S.documentTypeListItem('filterStrings').title('Filter Strings'),
                      S.documentTypeListItem('voteStrings').title('Vote Strings'),
                      S.documentTypeListItem('footerStrings').title('Footer Strings'),
                      S.documentTypeListItem('termsStrings').title('Terms Strings'),
                    ])
                ),

              S.divider(),

              S.documentTypeListItem('homepageImages').title('Homepage Images'),
            ])
        ),
    ])
