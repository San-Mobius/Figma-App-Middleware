const fs = require("fs");

const categoryMapping = {
  "rounded": "border-radius",
  "color": "color",
  "bg": "background-color",
  'margin': 'margin',
  'margin-top': 'margin-top',
  'margin-bottom': 'margin-bottom',
  'margin-left': 'margin-left',
  'margin-right': 'margin-right',
  'padding': 'padding',
  'padding-top': 'padding-top',
  'padding-bottom': 'padding-bottom',
  'padding-left': 'padding-left',
  'padding-right': 'padding-right',
  'width': 'width',
  'height': 'height',
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
    'colors' : ['color', 'bg'],
    'color': 'color',
    'bg': 'bg',
    'container': 'container',
    'spacing': ['margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'width', 'height'],
    'margin': 'margin',
    'margin-top': 'margin-top',
    'margin-bottom': 'margin-bottom',
    'margin-left': 'margin-left',
    'margin-right': 'margin-right',
    'padding': 'padding',
    'padding-top': 'padding-top',
    'padding-bottom': 'padding-bottom',
    'padding-left': 'padding-left',
    'padding-right': 'padding-right',
    'width': 'width',
    'height': 'height',
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
              let className;
              if(Array.isArray(varArr[key])) {
                varArr[key].map((item,index) => {
                  className = String(match[1]).replace(key, varArr[key][index]);
                  variables.push({ "className": className, "variableName": match[1], "key": varArr[key][index] });
                })
              } else {
                className = String(match[1]).replace(key, varArr[key]);
                variables.push({ "className": className, "variableName": match[1], "key": key });
              }
            }
          })
        }

        // Generate utility classes
        const classes = variables
          .map((v) => {
            if(Array.isArray(varArr[v.key])) {
              let classObj = '';
              varArr[v.key].map((item,i)=> {
                classObj = `
.${v.className} {
  ${categoryMapping[varArr[v.key][i]]}: var(--${v.variableName});
}
                `
              })
              return classObj;
            }
            else if(categoryMapping[varArr[v.key]]) {
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