import { ThemeOptions } from '@mui/material';
import { pxToRem, rgba } from './functions';

const color = {
  heading: '#fff',
  body: '#a1a1aa',
};

const fontSize = (size: string, lineHeight: string) => ({
  fontSize: size,
  lineHeight,
});

const baseProperties = {
  fontFamily:
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  fontWeightLighter: 100,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  fontSizeXS: fontSize('0.85rem', '1.5rem'),
  fontSizeSM: fontSize('0.95rem', '1.5rem'),
  fontSizeMD: fontSize('1.125rem', '1.75rem'),
  fontSizeLG: fontSize('1.25rem', '1.75rem'),
  fontSizeXL: fontSize('1.5rem', '2rem'),
};

const baseHeadingProperties = {
  fontFamily: baseProperties.fontFamily,
  color: color.heading,
  fontWeight: baseProperties.fontWeightBold,
};

const typography: ThemeOptions['typography'] = {
  fontFamily: baseProperties.fontFamily,
  // fontWeightLighter: baseProperties.fontWeightLighter,
  fontWeightLight: baseProperties.fontWeightLight,
  fontWeightRegular: baseProperties.fontWeightRegular,
  fontWeightMedium: baseProperties.fontWeightMedium,
  fontWeightBold: baseProperties.fontWeightBold,

  h1: {
    fontSize: pxToRem(48),
    lineHeight: 1.25,
    ...baseHeadingProperties,
  },

  h2: {
    fontSize: pxToRem(36),
    lineHeight: 1.3,
    ...baseHeadingProperties,
  },

  h3: {
    fontSize: pxToRem(30),
    lineHeight: 1.375,
    ...baseHeadingProperties,
  },

  h4: {
    fontSize: pxToRem(24),
    lineHeight: 1.375,
    ...baseHeadingProperties,
  },

  h5: {
    fontSize: pxToRem(20),
    lineHeight: 1.375,
    ...baseHeadingProperties,
  },

  h6: {
    fontSize: pxToRem(16),
    lineHeight: 1.625,
    ...baseHeadingProperties,
  },

  subtitle1: {
    fontFamily: baseProperties.fontFamily,
    fontSize: baseProperties.fontSizeXL.fontSize,
    lineHeight: baseProperties.fontSizeXL.lineHeight,
    fontWeight: baseProperties.fontWeightLight,
    color: color.heading,
  },

  subtitle2: {
    fontFamily: baseProperties.fontFamily,
    fontSize: baseProperties.fontSizeLG.fontSize,
    lineHeight: baseProperties.fontSizeLG.lineHeight,
    fontWeight: baseProperties.fontWeightLight,
    color: color.heading,
  },

  body1: {
    fontFamily: baseProperties.fontFamily,
    fontSize: baseProperties.fontSizeMD.fontSize,
    lineHeight: baseProperties.fontSizeMD.lineHeight,
    fontWeight: baseProperties.fontWeightLight,
    color: rgba(color.body, 0.9),
  },

  body2: {
    fontFamily: baseProperties.fontFamily,
    fontSize: baseProperties.fontSizeMD.fontSize,
    lineHeight: baseProperties.fontSizeMD.lineHeight,
    fontWeight: baseProperties.fontWeightLight,
    color: rgba(color.body, 0.85),
  },

  button: {
    fontFamily: baseProperties.fontFamily,
    fontSize: baseProperties.fontSizeSM.fontSize,
    lineHeight: baseProperties.fontSizeSM.lineHeight,
    fontWeight: baseProperties.fontWeightRegular,
    textTransform: 'uppercase',
  },

  caption: {
    fontFamily: baseProperties.fontFamily,
    fontSize: baseProperties.fontSizeXS.fontSize,
    lineHeight: baseProperties.fontSizeXS.lineHeight,
    fontWeight: baseProperties.fontWeightLight,
    color: color.body,
  },

  overline: {
    fontFamily: baseProperties.fontFamily,
    color: color.body,
  },
};

export default typography;
