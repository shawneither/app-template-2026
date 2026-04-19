
/**
 * Parsing Strings
 *
 * Many text strings in the data files need to contain extra formatting.
 * These functions are for parsing those extras in various ways.
 * Example: convert "This [word]." into "This <span>word</span>."
 * */

export function bracketsToElm(string, elmName) {

  // TODO: Error-checking attempt
  // if (string === '' || typeof myVar != 'string') return document.createTextNode('');

  const regex  = /\[(.*?)\]/g;
  const final  = `<${elmName}>$1</${elmName}>`;
  const output = string.replace(regex, final);
  return document.createRange().createContextualFragment(output); // Awesome: https://davidwalsh.name/convert-html-stings-dom-nodes
}

export function bracketsToDocPath() {

}

export function bracketsToAuxData() {

}

///////////////////////////////////////////////////////////////
// Dates

export const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const monthNames   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDateTimeString(dateObj) { // Format: Tue, 3 Dec 2025, 16:05
  const weekday = weekdayNames[dateObj.getDay()].slice(0,3);
  const day     = dateObj.getDate();
  const month   = monthNames[dateObj.getMonth()].slice(0,3);
  const year    = dateObj.getFullYear();
  const hour    = dateObj.getHours();
  const min     = String(dateObj.getMinutes()).padStart(2, '0');
  return `${weekday} ${day} ${month} ${year}, ${hour}:${min}`;
}

// Convert milliseconds into useful time units // Thanks: https://stackoverflow.com/a/59875447
export function msToDHMS(mseconds) {
  const seconds = Math.floor(mseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours   / 24);
  return {
    day: days,
    hr:  hours   % 24,
    min: minutes % 60,
    sec: seconds % 60
  }
}


///////////////////////////////////////////////////////////////

/**
 * Given an array of consecutive child keys,
 * walk that path through the given object,
 * returning the result.
 * (Also *seems* to work with numbered indices)
 *  */

export function walkObjectByArray(object, array) {
  let output = object;
  array.forEach(item => { output = output[item] });
  return output;
}


///////////////////////////////////////////////////////////////

function timeout(ms) { // Thanks https://stackoverflow.com/a/33292942
    return new Promise(resolve => setTimeout(resolve, ms));
}


///////////////////////////////////////////////////////////////
// Maths

export function lerp(norm, min, max) { //// lerp = linear interpolation: 0-1 mapped to real range
  return (max - min) * norm + min;
}

export function norm(value, min, max) { //// norm = normalization: real range mapped to 0-1
  return (value - min) / (max - min);
}

export function decimals(value, precision) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function stripExtraSlashes(str) { //// Thanks: https://stackoverflow.com/a/36242700
  const str0 = str.replace(/\/+/g, '/'); //// convert any multiple slashes (ie '////') into a single slash
  const str1 = str0.endsWith('/') ? str0.slice(0, -1) : str0; //// remove any trailing slash
  const str2 = str1.startsWith('/') ? str1.slice(1) : str1; //// remove any leading slash
  return str2;
}

export function circumferenceFromRadius(radius) {
  return (2 * Math.PI) * radius; // C = 2π × r - you know this from school
}


///////////////////////////////////////////////////////////////
// Easing functions, all 0-1, thanks https://easings.net/

export function easeInQuad(x) {
  return x * x;
}

export function easeInCubic(x) {
  return x * x * x;
}

export function easeInQuart(x) {
  return x * x * x * x;
}

export function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

export function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}
