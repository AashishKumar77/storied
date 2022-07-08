export const titleCase = (str) =>{
  if(str === "" || str === undefined || str === null) return ""
  //Skip below list of articels/prepostions/conjunctions/conjugations from TitleCase
  const articles = ['an', 'the'];
  const conjunctions = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so','if'];
  const prepositions = ['with', 'at', 'from', 'into','upon', 'of', 'to', 'in', 'for', 'it', 
  'as', 'my', 'on', 'by', 'like', 'over', 'plus', 'but', 'up', 'down', 'off', 'near', 
  'van', 'den', 'von', 'und', 'der', 'de', 'da'];
  const conjugations = ['is', 'am', 'are', 'was', 'were', 'being', 'been']
  //Always capitalize below list of uppercase_exceptions
  const uppercase_exceptions =['usa', 'uk', 'ii', 'iii', 'iv', 'vi', 'vii', 'viii', 'ix']

  // Replace other characters with space
  const replaceCharsWithSpace = (newstr) => newstr.replace(/[^0-9?a-z(),.;'/\-&\\ÀÁÂÄàáâäÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÖòóôöÙÚÛÜùúûüƒÿÜŸçÇßÐÑ×ÝÞßðñýæåœøÆÅŒØ€þ∙]/gi, ' ').replace(/(\s\s\s)/gi, ' ');
  const capitalizeFirstLetter = (newstr) => newstr.charAt(0).toUpperCase() + newstr.substr(1);
  const normalizeStr = (newstr) => newstr.toLowerCase();
  const shouldCapitalize = (word, fullWordList, posWithinStr) => {
    if (word.includes("l'") && word.length >2 && word.indexOf("l'") === 0){
      words[posWithinStr] = "l'" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.includes("o'") && word.length >2 && word.indexOf("o'") === 0){
      words[posWithinStr] = "O'" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.includes("d'") && word.length >2 && word.indexOf("d'") === 0){
      words[posWithinStr] = "d'" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.includes("mc") && word.length >2 && word.indexOf("mc") === 0){
      words[posWithinStr] = "Mc" + word.charAt(2).toUpperCase() + word.slice(3)
      return false
    }
    else if (word.includes("st.") && word.length >3 && word.indexOf("st.") === 0){
      words[posWithinStr] = "St." + word.charAt(3).toUpperCase() + word.slice(4)
      return false
    }
    if ((posWithinStr == 0)) {
      return true;
    }
    return !(articles.includes(word) || conjunctions.includes(word) || conjugations.includes(word) || prepositions.includes(word));
  }
  //convert character after '-' to uppercase
  const transformToUpperCase = (convertstr, separators) => {
    separators = separators || [ ' ' ];
    const regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    return convertstr.toLowerCase().replace(regex, function(x) { return x.toUpperCase(); });
  }

  str = replaceCharsWithSpace(str);
  str = normalizeStr(str);

  let words = str.split(' ')
  for (let i = 0; i < words.length; i++) {
    if (uppercase_exceptions.includes(words[i]))
      words[i] = words[i].toUpperCase()
    else if(words[i].includes('-'))
      words[i] = transformToUpperCase(words[i], ['-'])
    else 
      words[i] = (shouldCapitalize(words[i], words, i) ? capitalizeFirstLetter(words[i]) : words[i]); 
  }
  return  words.join(' ');
}