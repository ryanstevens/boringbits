

export default () => {
  const theme = {
    typography: {
      useNextVariants: true,
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
      ].join(','),
    },
  };

  return theme;
};
