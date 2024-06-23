import { ThemeOptions, createTheme } from '@mui/material';
import typography from './typography';

export const color = {
  white: '#FFFFFF',
  primary: '#7434DB',
  secondary: '#52555A',
  info: '#1A73E8',
  success: '#4CAF50',
  warning: '#fb8c00',
  error: '#F44335',
};

const palette: ThemeOptions['palette'] = {
  mode: 'dark',
  background: {
    default: '#08070B',
    paper: '#111111',
    // paper:"#2A2A2D"
  },
  text: {
    primary: color.white,
    secondary: color.white,
  },

  primary: {
    main: color.primary,
  },

  secondary: {
    main: color.secondary,
  },

  info: {
    main: color.info,
  },

  success: {
    main: color.success,
  },

  warning: {
    main: color.warning,
  },

  error: {
    main: color.error,
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
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
        text: {
          color: color.white,
        },
        outlinedSecondary: {
          color: color.white,
          opacity: 0.6,
        },
      },
    },
    MuiTypography: {},
  },
});
