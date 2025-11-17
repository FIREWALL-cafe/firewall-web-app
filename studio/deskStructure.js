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

      // Pages section - Events, Press, and Page content
      S.listItem()
        .title('Pages')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Page Content')
            .items([
              // Editorial Articles
              S.listItem()
                .title('Editorial Articles')
                .icon(() => '📰')
                .child(
                  S.documentTypeList('editorialArticle')
                    .title('All Editorial Articles')
              ),
              
              // Events
              S.listItem()
                .title('Events')
                .icon(() => '📅')
                .child(
                  S.documentTypeList('event')
                    .title('All Events')
                ),

              // Press
              S.listItem()
                .title('Press')
                .icon(() => '📰')
                .child(
                  S.documentTypeList('pressArticle')
                    .title('Press Articles')
                ),

              S.divider(),

              // Page UI Strings (direct children)
              S.documentTypeListItem('homepageStrings').title('Homepage').icon(() => '📄'),
              S.documentTypeListItem('searchPageStrings').title('Search Page').icon(() => '📄'),
              S.documentTypeListItem('archivePageStrings').title('Archive Page').icon(() => '📄'),
              S.documentTypeListItem('aboutPageStrings').title('About Page').icon(() => '📄'),
              S.documentTypeListItem('editorialPageStrings').title('Editorial Page').icon(() => '📄'),
              S.documentTypeListItem('pressPageStrings').title('Press Page').icon(() => '📄'),
              S.documentTypeListItem('supportPageStrings').title('Support Page').icon(() => '📄'),
              S.documentTypeListItem('contactPageStrings').title('Contact Page').icon(() => '📄'),
            ])
        ),

      // Components section
      S.listItem()
        .title('Components')
        .icon(() => '🧩')
        .child(
          S.list()
            .title('Reusable Components')
            .items([
              // Timeline Events
              S.listItem()
                .title('Timeline Events')
                .icon(() => '🧩')
                .child(
                  S.documentTypeList('timelineEvent')
                    .title('All Timeline Events')
                ),
              S.documentTypeListItem('filterStrings').title('Filter Controls').icon(() => '🧩'),
              S.documentTypeListItem('voteStrings').title('Vote Categories').icon(() => '🧩'),
              S.documentTypeListItem('termsStrings').title('Terms and Conditions').icon(() => '🧩'),
              S.listItem()
                .title('Navigation Menu')
                .icon(() => '🧩')
                .child(
                  S.documentTypeList('navigationSettings')
                    .title('Navigation Settings')
                ),
            ])
        ),

      S.divider(),

      // Partners
      S.listItem()
        .title('Partners')
        .icon(() => '🤝')
        .child(
          S.documentTypeList('partner')
            .title('All Partners')
        ),

      S.divider(),

      // Global Settings
      S.listItem()
        .title('Global Settings')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Site-Wide Settings')
            .items([
              S.documentTypeListItem('globalStrings').title('Global Strings'),
              S.documentTypeListItem('footerStrings').title('Footer Strings'),
              S.divider(),
              S.documentTypeListItem('homepageImages').title('Homepage Images').icon(() => '🖼️'),
              S.documentTypeListItem('siteAssets').title('Site Assets').icon(() => '🎨'),
            ])
        ),
    ])
