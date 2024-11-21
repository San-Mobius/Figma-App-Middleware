const fs = require('fs');
const path = require('path');

const saveAsJson = (data, filePath) => {
    const directory = path.dirname(filePath); // Extract the directory path
  
    // Ensure the directory exists or create it
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  
    // Save the data as a JSON file
    const jsonData = JSON.stringify(data, null, 2); // Format the JSON with indentation
    fs.writeFileSync(filePath, jsonData, 'utf8');
  };

module.exports = { saveAsJson }