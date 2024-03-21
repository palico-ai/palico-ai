import { AIAction } from '@palico-ai/lexical';

export const aiActions: AIAction[] = [
  {
    name: 'create_blog_post',
    label: 'Create a blog post',
    promptForFreeText: true,
  },
  {
    name: 'ask_ai_to_write',
    label: 'Ask AI to write',
    promptForFreeText: true,
  },
  {
    name: "create_pricing_proposal",
    label: "Create a pricing proposal",
  },
  {
    name: "create_product_brief",
    label: "Create product brief template",
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
      },
    ],
  },
  {
    name: 'extract_insights',
    label: 'More Options',
    requiresRangeSelection: true,
    options: [
      {
        label: 'Create an outline',
        value: 'create_outline',
      },
      {
        label: 'Create an abstract',
        value: 'create_abstract',
      },
      {
        label: 'Create Action Items',
        value: 'create_action_items',
      },
    ],
  }
];
