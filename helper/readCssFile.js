const fs = require('fs');
const path = require('path');

const importCSS = (filePath) => {
  try {
    const cssContent = fs.readFileSync(filePath, 'utf8'); // Read the CSS file
    return cssContent;
  } catch (err) {
    throw err;
  }
};


module.exports = { importCSS }