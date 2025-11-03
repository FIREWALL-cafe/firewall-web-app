import {defineType} from 'sanity'

export default defineType({
  name: 'termsStrings',
  title: 'Terms and Conditions Modal',
  type: 'document',

  // Singleton - only one document should exist
  fields: [
    {
      name: 'modalTitle',
      title: 'Modal - Title',
      type: 'localeString',
      description: 'Title for terms modal (e.g., "Terms")',
    },
    {
      name: 'buttonAccept',
      title: 'Button - Accept',
      type: 'localeString',
      description: 'Accept button text',
    },
    {
      name: 'buttonReject',
      title: 'Button - Reject',
      type: 'localeString',
      description: 'Reject button text',
    },
    {
      name: 'buttonAccessFirewall',
      title: 'Button - Access Firewall',
      type: 'localeString',
      description: 'Button text to access Firewall after accepting',
    },
    {
      name: 'errorMustAccept',
      title: 'Error - Must Accept Terms',
      type: 'localeString',
      description: 'Error message when user rejects terms',
    },
    {
      name: 'errorUsernameTooLong',
      title: 'Error - Username Too Long',
      type: 'localeString',
      description: 'Validation error for username length (max 30 characters)',
    },
    {
      name: 'errorUsernameInvalidChars',
      title: 'Error - Username Invalid Characters',
      type: 'localeString',
      description: 'Validation error for username characters (letters, numbers, underscores only)',
    },
    {
      name: 'usernamePrompt',
      title: 'Username - Prompt',
      type: 'localeString',
      description: 'Text prompting user to enter optional username',
    },
    {
      name: 'usernamePlaceholder',
      title: 'Username - Placeholder',
      type: 'localeString',
      description: 'Placeholder text for username input field',
    },
    {
      name: 'termsParagraph1Bold',
      title: 'Terms - Paragraph 1 Bold',
      type: 'localeString',
      description: 'Bold text: "Your participation in FIREWALL provides your consent."',
    },
    {
      name: 'termsParagraph1',
      title: 'Terms - Paragraph 1',
      type: 'localeText',
      description: 'First paragraph of terms (after bold text)',
    },
    {
      name: 'termsParagraph2Bold',
      title: 'Terms - Paragraph 2 Bold',
      type: 'localeString',
      description: 'Bold text: "FIREWALL does not monitor or review the content of your Search Session."',
    },
    {
      name: 'termsParagraph2',
      title: 'Terms - Paragraph 2',
      type: 'localeText',
      description: 'Second paragraph of terms (after bold text)',
    },
    {
      name: 'termsParagraph3',
      title: 'Terms - Paragraph 3',
      type: 'localeText',
      description: 'Third paragraph about privacy and security',
    },
    {
      name: 'termsParagraph4',
      title: 'Terms - Paragraph 4',
      type: 'localeText',
      description: 'Fourth paragraph about responsibility and IP recording',
    },
  ],

  preview: {
    prepare() {
      return {
        title: 'Terms and Conditions Modal',
        subtitle: 'Manage terms modal text (15 fields)',
      }
    },
  },
})
