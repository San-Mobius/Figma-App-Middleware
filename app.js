const designToken  = require('./design-tokens.tokens.json');
const { FigmaToJsonClass } = require('./helper/FigmaToJsonClass');
const { importCSS } = require('./helper/readCssFile');

// TODO : create logic Grid
const figToJsonObj = new FigmaToJsonClass(()=> {
    try {
        let css = importCSS('./build/css/_variables.css')
        console.log('--> Import Build Css File Done');
    } catch (e) {
        console.error('Error reading the CSS file:', err.message);
    }
});

figToJsonObj.initializeFlow();
figToJsonObj.transformTokenToStyleDictionaryInput(designToken);