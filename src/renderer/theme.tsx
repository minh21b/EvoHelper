import { createTheme, Theme, ThemeOptions } from '@mui/material';
import { grey } from '@mui/material/colors';
import darkScrollbar from '@mui/material/darkScrollbar';

export const defaultTheme: Theme = createTheme();

export const themeConfig: ThemeOptions = {
  shape: {
    borderRadius: 8,
  },
  palette: {
    mode: 'dark',
    primary: {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#e5e5e5",
      "300": "#d4d4d4",
      "400": "#a3a3a3",
      "500": "#737373",
      "600": "#525252",
      "700": "#404040",
      "800": "#262626",
      "900": "#171717"
    },
    background: {
      paper: grey[900],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#141D28',
        },
      },
    },
  },
};

export default createTheme(themeConfig);
