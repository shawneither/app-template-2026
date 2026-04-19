/**
* Convenience function for creating DOM elements
* Usage:
* elm({ type: 'button', attrs: { key: 'value' } })
*/

export function elm({ // These are 'simulated' named paramers (with defaults) - https://exploringjs.com/js/book/ch_callables.html#simulating-named-parameters
    type       = 'div',
    href       = null,
    id         = null,
    classes    = null,
    text       = null,
    src        = null,
    title      = null,
    attrs      = null,
    data_attrs = null,
    html       = null
  } = {}) {

  const element = document.createElement(type);

  if (href) { element.setAttribute('href', href); }
  if (id)   { element.setAttribute('id', id); }
  if (text) { element.textContent = text; }
  if (classes) {
    if (Array.isArray(classes)) {
      element.classList.add(...classes); // spread array to flat values
    } else {
      element.classList = classes;
    }
  }

  if (src) { element.setAttribute('src', src); }

  if (title) { element.setAttribute('title', title); }

  if (attrs) {
    for (const key in attrs) {
      element.setAttribute(key, attrs[key]);
    }
  }

  if (data_attrs) {
    for (const key in data_attrs) {
      element.setAttribute(`data-${key}`, data_attrs[key]);
    }
  }

  //// This is dangerous to provide, but allows basic formatting such as <b> and <i> to be kept in the JSON
  if (html) { element.innerHTML = html; }

  return element;
}


export function txt(string) {
  return document.createTextNode(string);
}


//////////////////////////////////////////////////////////////
// SVG

export function svg(viewBox = null, classes = null, pxWidth = null, pxHeight = null) {
  var svgElm = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (viewBox)  svgElm.setAttribute('viewBox', viewBox);
  // Add classes from either array or string
  // if (classes)  svgElm.classList.add( Array.isArray(classes) ? ...classes : classes ); // NO! Spread cant be used directly within ternary.
  if (classes)  svgElm.classList.add( ...(Array.isArray(classes) ? classes : [classes]) ); // YES! Instead spead operation wraps whole ternary. Convert classes non-array into array to prevent string being split up. Thanks: https://stackoverflow.com/a/62701562
  if (pxWidth)  svgElm.setAttribute('width', `${pxWidth}px`);
  if (pxHeight) svgElm.setAttribute('height', `${pxHeight}px`);
  return svgElm;
}

export function svgWithUse(useHref, viewBox = null, classes = null, pxWidth = null, pxHeight = null) {
  const svgElm = svg(viewBox, classes, pxWidth, pxHeight);
  const useElm = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useElm.setAttribute('href', useHref);
  useElm.setAttribute('fill', 'currentColor');
  svgElm.appendChild(useElm);
  return svgElm;
}




//////////////////////////////////////////////////////////////
// Specific uses

export function card({
    content = { items: [], mediapath: '' },
    flippable = false,
    draggable = false
  } = {}) {

  const card  = elm({ type: 'div', classes: 'card' });
  const sides = elm({ type: 'div', classes: 'sides' });
  const face  = elm({ type: 'div', classes: 'face' });

  content.items.forEach( item => {
    const group = elm({ type: 'div', classes: 'group' });
    const image = elm({ type: 'img', attrs: { 'src': `${content.mediapath}${item.image}` } });
    const text  = elm({ type: 'p',   classes: 'html', text: item.text });
    group.appendChild(image);
    group.appendChild(text);
    face.appendChild(group);
  });

  sides.appendChild(face);

  if (flippable) {
    const back = elm({ type: 'div', classes: 'back' });
    // const pattern = elm({ type: 'div', classes: `pattern ${cssBackPattern}` });
    const pattern = elm({ type: 'div', classes: `pattern` });
    back.appendChild(pattern);
    sides.appendChild(back);
  }

  card.appendChild(sides);

  return card;
}
