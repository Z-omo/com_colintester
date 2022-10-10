/**
 * Browser DOM manager: provides helper functions for DOM manipulation.
 *
 * @package     Focus-App
 * @author      Colin Tester <office@z-omo.com>
 * 
 * This file forms part of the installed @package and should not be copied 
 * and/or distributed without the written consent from the file's author.
 *
 * @copyright: Please see: <https://en.wikipedia.org/wiki/Berne_Convention>
 *
 * This file and its @package are under version control.
 */
'use strict';

const DOM = {

  html: document.querySelector('html'),
  body: document.querySelector('body'),
  customEvents: null,

  addClass(className, element)
  {
    if (!element) { return; }
    if (element.classList)
    {
      className.trim().split(' ')
        .forEach((name) => element.classList.add(name));
      
      // Would prefer the following but IE does not support multiple arguments.
      // element.classList.add(...classNames);

    } else {

      let classNames = (element.className) ? element.className + ' ' : '';
      classNames += className;
      element.className = classNames;
    }
  },

  hasClass(className, element)
  {
    if (element.classList)
    {
      return (element.classList && element.classList.contains(className));

    } else {
      
      let regexName = new RegExp('[\w\s]*'+ className + '[\s\w]*');
      return regexName.test(element.className);
    }
  },

  toggleClass(className, element)
  {
    element.classList.toggle(className);
  },

  removeClass(className, element)
  {
    if (!element) { return; }
    
    if (element.classList)
    {
      element.classList.remove(className);
    } else {
      element.className = element.className
        .replace( new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    if ('' === element.className) { element.removeAttribute('class'); }
  },

  hide(elements)
  {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = 'none');
  },

  show(elements)
  {
    if (Array !== (elements).constructor) { elements = [elements]; }
    elements.forEach(e => e.style.display = '');
  },

  setStyle(rules, element)
  {
    for (let prop in rules)
    {
      if (rules.hasOwnProperty(prop)) { element.style[prop] = rules[prop]; }
    }
  },

  setAttrs(attrs, element)
  {
    for (let prop in attrs)
    {
      if (attrs.hasOwnProperty(prop))
      {
        element.setAttribute(prop, attrs[prop]);
      }
    }
  },

  hasAttr(attrName, element)
  {
    return element.getAttribute(attrName);
  },

  tagIs(tagName, element)
  {
    if (!element) { return; }
    return element.tagName.toLowerCase() === tagName.toLowerCase();
  },
  
  getAll(selector, element = document)
  {
    let nodes = element.querySelectorAll(selector);
    if (!nodes || 0 === nodes.length) { return; }
  
   /*
    * convert NodeList to an Array, otherwise IE throws error on a
    * subsequent forEach:
    */
    return Array.prototype.slice.call(nodes);
  },

  add(element, container)
  {
    container.appendChild(element);
  },

  prepend(element, container)
  {
    container.insertBefore(element, container.firstChild);
  },

  parent(element, selector)
  {
    if (!element) { return; }
    let target = element;
    let found;
    let parent;
    
    do
    {
      parent = target.parentNode;
      if (!parent) { break; }

      found = !selector || this.hasClass(selector, parent);
      target = parent;
    } while (!found && parent);
  
    return parent;
  },

  viewDims(element)
  {
    let dims;

    if (!element )
    {
      dims = {
        top:    window.pageYOffset,
        width:  window.innerWidth,
        height: window.innerHeight,
        bottom: window.pageYOffset + window.innerHeight
      };

    } else {

      dims = element.getBoundingClientRect();
    }
    
    return dims;
  },

  trigger(eventName, element, data)
  {
    let event = getCustomEvent(eventName, data);
    if (!event)
    {
      throw new Error('Unable to trigger custom event: ' + eventName);
    }

    element.dispatchEvent(event);
  }
};

export default DOM;


function getCustomEvent(eventName, data)
{  
  if (DOM.customEvents && DOM.customEvents[eventName])
  {
    return DOM.customEvents[eventName];
  }

  let event = createCustomEvent(eventName, data);

  registerCustomEvent(eventName, event);
  return event;
}

function createCustomEvent(eventName, data)
{
  if ('function' !== typeof window.CustomEvent)
  {
    CustomEvent.prototype = window.Event.prototype;
  }

  let event = new CustomEvent(eventName, data && { detail: data });
  return event;
}

/*
 * Polyfill code gleaned from MDN: 
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
function CustomEvent(event, params)
{
  params = params || { 
    bubbles: false, cancelable: false, detail: undefined
  };
  
  let evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(
    event, params.bubbles, params.cancelable, params.detail
  );
  
  return evt;
}

function registerCustomEvent(eventName, event)
{
  if (null === DOM.customEvents) { DOM.customEvents = {}; }
  DOM.customEvents[eventName] = event;
}
