const path = require('path');

module.exports = {
  // Purge option will check the files for used classes, so unused classes can be purged, optimizing for production
  purge: [
    path.join(__dirname, 'src', 'Pages', '*.{js,jsx,ts,tsx}'),
    path.join(__dirname, 'src', 'Pages', 'Components', '*.{js,jsx,ts,tsx}')
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        tourney: ['Tourney', 'cursive']
      },
      minWidth: {
        "300px": "300px"
      },
      maxWidth: {
        "50vw": "50vw"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
