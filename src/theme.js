import { createMuiTheme } from '@material-ui/core/styles';

const breakpointValues = {
  lr: 1100,
  md: 800,
};


const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Maven Pro',
      ].join(',')
    },
    palette: {
      primary: {
        main: "#41B3A3",
        contrastText: "#fff"
      },
      text: {
        primary: "#fff",
        secondary: "#41B3A3"
      },
      background: {
        default: "#949494"
      },
    },
    breakpoints: {
       values: breakpointValues,
    },
  });

  export default theme;