import { ThemeOptions } from '@mui/material';
import { pxToRem } from './functions';
import { THEME_COLOR } from './colors';

export const color = THEME_COLOR.typography;

const fontSize = (size: string, lineHeight: string) => ({
  fontSize: size,
  lineHeight,
});

export const TYPOGRAPHY_PROPERTIES = {
  fontFamily:
    'ui-sans-serif, sans-serif, system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  fontWeightLighter: 100,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  fontSizeXS: fontSize('0.8125rem', '1.5rem'),
  fontSizeSM: fontSize('0.87rem', '1.5rem'),
  fontSizeMD: fontSize('1rem', '1.75rem'),
  fontSizeLG: fontSize('1.25rem', '1.75rem'),
  fontSizeXL: fontSize('1.5rem', '2rem'),
};

const baseHeadingProperties = {
  fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
  color: color.heading,
  fontWeight: TYPOGRAPHY_PROPERTIES.fontWeightBold,
};

const typography: ThemeOptions['typography'] = {
  fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
  // fontWeightLighter: baseProperties.fontWeightLighter,
  fontWeightLight: TYPOGRAPHY_PROPERTIES.fontWeightLight,
  fontWeightRegular: TYPOGRAPHY_PROPERTIES.fontWeightRegular,
  fontWeightMedium: TYPOGRAPHY_PROPERTIES.fontWeightMedium,
  fontWeightBold: TYPOGRAPHY_PROPERTIES.fontWeightBold,

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
    fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
    fontSize: TYPOGRAPHY_PROPERTIES.fontSizeXL.fontSize,
    lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeXL.lineHeight,
    fontWeight: TYPOGRAPHY_PROPERTIES.fontWeightLight,
    color: color.heading,
  },

  subtitle2: {
    fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
    fontSize: TYPOGRAPHY_PROPERTIES.fontSizeLG.fontSize,
    lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeLG.lineHeight,
    fontWeight: TYPOGRAPHY_PROPERTIES.fontWeightLight,
    color: color.heading,
  },

  body1: {
    fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
    fontSize: TYPOGRAPHY_PROPERTIES.fontSizeMD.fontSize,
    lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeMD.lineHeight,
    fontWeight: TYPOGRAPHY_PROPERTIES.fontWeightRegular,
    color: color.bodyMain,
  },

  body2: {
    fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
    fontSize: TYPOGRAPHY_PROPERTIES.fontSizeMD.fontSize,
    lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeMD.lineHeight,
    fontWeight: TYPOGRAPHY_PROPERTIES.fontWeightRegular,
    color: color.bodySecondary,
  },

  button: {
    fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
    // fontSize: TYPOGRAPHY_PROPERTIES.fontSizeSM.fontSize,
    // lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeSM.lineHeight,
    color: color.bodyMain,
    fontWeight: TYPOGRAPHY_PROPERTIES.fontWeightRegular,
    textTransform: 'uppercase',
  },

  caption: {
    fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
    fontSize: TYPOGRAPHY_PROPERTIES.fontSizeXS.fontSize,
    lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeXS.lineHeight,
    fontWeight: TYPOGRAPHY_PROPERTIES.fontWeightLight,
    color: color.bodySecondary,
  },

  overline: {
    fontFamily: TYPOGRAPHY_PROPERTIES.fontFamily,
    color: color.bodySecondary,
  },
};

export default typography;
