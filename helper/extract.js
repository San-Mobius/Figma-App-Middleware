const getValueAccordingToType = (type, value) => {
  let returnValue = value;
  switch(type) {
    case "dimension" : 
      returnValue = `${value}px`;
      break;
    case "string": 
      returnValue = `${value}`;
      break;
    case "custom-shadow": 
      returnValue = {
        color : value.color,
        offsetX : `${value.offsetX}px`,
        offsetY : `${value.offsetY}px`,
        radius : `${value.radius}px`,
        shadowType : value.shadowType,
        spread : `${value.spread}px`
      }
      break;
    case "custom-fontStyle": 
      returnValue = {
        fontFamily : value.fontFamily,
        fontSize : `${value.fontSize}px`,
        fontStretch : value.fontStretch,
        fontStyle : value.fontStyle,
        fontWeight : `${value.fontWeight}`,
        letterSpacing : `${value.letterSpacing}px`,
        lineHeight : `${value.lineHeight}px`,
        paragraphIndent : `${value.paragraphIndent}px`,
        paragraphSpacing : `${value.paragraphSpacing}px`,
        textCase : value.textCase,
        textDecoration : value.textDecoration,
      }
      break;
  }
  return returnValue
}

function transform(figmaTokens, styleDictionary) {
  if (figmaTokens) {
    if (figmaTokens.value) {
      // If figmaTokens has a value, set it under $value
      styleDictionary['$value'] = getValueAccordingToType(figmaTokens.type, figmaTokens.value);
    } else {
      // If figmaTokens has nested categories, iterate over them
      for (const [category, tokens] of Object.entries(figmaTokens)) {
        if(figmaTokens[category] && Object.entries(figmaTokens[category]).length && typeof figmaTokens[category] == 'object') {
          styleDictionary[category] = {}; // Ensure category is initialized
          styleDictionary[category] = transform(tokens, styleDictionary[category]); // Recursively transform
        }
      }
    }
  }

  return styleDictionary;
}

module.exports = { transform }