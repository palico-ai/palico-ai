import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Palico AI',
  tagline: 'Experiment-Driven Development',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://palico.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Palico AI', // Usually your GitHub org/user name.
  projectName: 'Palico Main', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/palico-ai/palico-main/tree/main/apps/docs',
        },
        gtag: {
          trackingID: 'G-Q39NFM4PTV',
          anonymizeIP: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Palico',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: 'https://palico-ai.github.io/palico-main/',
          label: 'API Reference',
          position: 'left',
        },
        { to: 'https://palico.ai/', label: 'Palico.AI', position: 'right' },
        {
          href: 'https://github.com/palico-ai/palico-main',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/tutorials/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://x.com/PalicoAI',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/8mP9ZV2Y',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Palico AI',
              to: 'https://www.palico.ai/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/palico-ai/palico-main',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Palico AI, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
