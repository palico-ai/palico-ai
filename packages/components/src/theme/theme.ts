import { ThemeOptions, createTheme } from '@mui/material';
import typography, { TYPOGRAPHY_PROPERTIES } from './typography';
import { THEME_COLOR } from './colors';

const palette: ThemeOptions['palette'] = {
  mode: 'dark',
  background: {
    // default: '#09090b',
    // paper: '#09090b',
    paper: '#0a0a0a',
    // paper: '#2A2A2D',
  },
  text: {
    primary: THEME_COLOR.typography.bodyMain,
    secondary: THEME_COLOR.typography.bodySecondary,
  },

  primary: {
    main: THEME_COLOR.primary,
    light: THEME_COLOR.primaryLight,
    dark: THEME_COLOR.primaryDark,
  },

  secondary: {
    main: THEME_COLOR.secondary,
  },

  info: {
    main: THEME_COLOR.info,
    light: THEME_COLOR.infoLight,
    dark: THEME_COLOR.infoDark,
  },

  success: {
    main: THEME_COLOR.success,
  },

  warning: {
    main: THEME_COLOR.warning,
  },

  error: {
    main: THEME_COLOR.error,
  },
  grey: {
    100: '#f8f9fa',
    200: '#f0f2f5',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
};

export const theme = createTheme({
  palette,
  typography,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1400,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFormLabel-root': {
            '&.Mui-focused': {
              color: THEME_COLOR.typography.bodyMain,
              opacity: 0.7,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '6px 16px',
          // fontWeight: 600,
          fontSize: TYPOGRAPHY_PROPERTIES.fontSizeXS.fontSize,
          lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeSM.lineHeight,
        },
        containedInfo: {
          // color: THEME_COLOR.typography.bodyMain,
          fontWeight: 600,
        },
        text: {
          color: THEME_COLOR.typography.bodyMain,
          fontSize: TYPOGRAPHY_PROPERTIES.fontSizeSM.fontSize,
          lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeSM.lineHeight,
          fontWeight: 600,
        },
        outlinedSecondary: {
          color: THEME_COLOR.typography.bodyMain,
        },
        sizeMedium: {
          padding: '6px 18px',
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: TYPOGRAPHY_PROPERTIES.fontSizeXS.fontSize,
          lineHeight: TYPOGRAPHY_PROPERTIES.fontSizeXS.lineHeight,
        },
        sizeLarge: {
          padding: '8px 20px',
        },
      },
    },
    MuiTypography: {},
    MuiTab: {
      styleOverrides: {},
    },
  },
});
