import { AIAction } from '@palico-ai/lexical';

export const aiActions: AIAction[] = [
  {
    name: 'create_blog_post',
    label: 'Create a blog post',
    promptForFreeText: true,
  },
  {
    name: 'extract_insights',
    label: 'Extract Insights',
    requiresRangeSelection: true,
    promptForFreeText: true,
  },
  {
    name: 'fix_grammar_and_spelling',
    label: 'Fix Grammar and Spelling',
    requiresRangeSelection: true,
  },
  {
    name: 'generate_summary',
    label: 'Generate Summary',
    requiresRangeSelection: true,
  },
  {
    name: 'translate_section',
    label: 'Translate Section',
    requiresRangeSelection: true,
    options: [
      {
        label: 'Spanish',
        value: 'spanish',
      },
      {
        label: 'French',
        value: 'french',
      },
      {
        label: 'German',
        value: 'german',
      },
      {
        label: 'Chinese',
        value: 'chinese',
      },
      {
        label: 'Japanese',
        value: 'japanese',
      },
    ],
  },
  {
    name: 'change_tone',
    label: 'Change Tone',
    requiresRangeSelection: true,
    options: [
      {
        label: 'Formal',
        value: 'formal',
      },
      {
        label: 'Casual',
        value: 'casual',
      },
      {
        label: 'Assertive',
        value: 'assertive',
      }
    ],
  },
  {
    name: 'ask_ai_to_write',
    label: 'Ask AI to write',
    promptForFreeText: true,
  },
];
