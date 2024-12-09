const fs = require("fs");

const categoryMapping = {
  "rounded": "border-radius",
  "color": "color",
  'container': 'width',
  'spacing': 'margin-inline',
  'width-max': 'max-width',
  'text': 'font',
  'text-uppercase': 'font',
  'text-line-through': 'font',
  'text-leading-none': 'font',
  'text-leading-tight': 'font',
  'shadow': 'box-shadow',
  'shadow-focus': 'box-shadow'
};

const varArr = {
    'border-radius-rounded' : 'rounded',
    'colors' : 'color',
    'container': 'container',
    'spacing': 'spacing',
    'width-max-w': 'width-max',
    'font-text': 'text',
    'font-uppercase-text': 'text-uppercase',
    'font-line-through': 'text-line-through',
    'font-leading-none': 'text-leading-none',
    'font-leading-tight': 'text-leading-tight',
    'shadow-shadow': 'shadow',
    'shadow-focus-rings-ring': 'shadow-focus'
  }

function createCssClasses(variablesFile = "build/css/_variables.css", outputFile = "build/css/utility.css") {
  return new Promise((res, rej) => {
    try {
      // Read variables file asynchronously
      fs.readFile(variablesFile, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading variables file:", err);
          rej(err);
          return;
        }


        // Extract CSS variables
        const variableRegex = /--([\w-]+):\s*(.+?);/g;
        const variables = [];
        let match;
        // let data = [];
        while ((match = variableRegex.exec(data)) !== null) {
          Object.keys(varArr).forEach((key)=> {
            if(match[1].includes(key)) {
              let className = String(match[1]).replace(key, varArr[key]);
              variables.push({ className: className, variableName: match[1], key: key });
            }
          })
        }

        // Generate utility classes
        const classes = variables
          .map((v) => {
            if(categoryMapping[varArr[v.key]]) {
              return `
.${v.className} {
  ${categoryMapping[varArr[v.key]]}: var(--${v.variableName});
}
                `;
            }
            return ''
          })
          .filter(Boolean) // Remove empty strings for unknown categories
          .join("\n");

        // Write the generated classes to utilities.css
        fs.writeFile(outputFile, classes, (writeErr) => {
          if (writeErr) {
            console.error("Error writing utilities file:", writeErr);
            rej(writeErr);
            return;
          }
          res(`${outputFile} Done`);
        });
      });
    } catch (err) {
      rej(err);
    }
  });
}

// Example usage
createCssClasses()
  .then((message) => console.log(message))
  .catch((error) => console.error("Error:", error));


module.exports = { createCssClasses }