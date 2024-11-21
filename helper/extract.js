const getValueAccordingToType = (type, value) => {
  let returnValue = value;
  switch(type) {
    case "dimension" : 
      returnValue = `${value}px`;
      break;
    case "string": 
      returnValue = `${value}`;
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