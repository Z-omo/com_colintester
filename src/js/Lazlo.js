/**
 * Module to faciliate the lazy loading of content.
 *
 * @package     Focus
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

import DOM from './dom-man';
import imageDims from './image-dims';

const Lazlo = {

  devMode: false,

  selectors: {
    resource:     'data-lazlo',
    legacy:       'data-original',
    resourceAttr: 'data-lazlo-attr',
    defaultAttr:  'src',
    watching:     'lazlo',
    loading:      'lazlo-loading',
    loaded:       'lazlo-loaded',
    completed:    'lazlo-completed'
  },

  watching: [],
  loaded: [],
  viewPort: null,
  watchCount: 0,

  watch(elements)
  {
    this.resetState();

    elements = elements || this.getResources();
    if (!elements || !elements.length) { return; }

    imageDims.setup();
    if (!this.scrollHandler) { this.setupScrollHandler(); }
  
    this.addToWatch(elements);
    this.checkView();
  },

  resetState: function()
  {
    this.watching = [];
    this.loaded = [];
    this.watchCount = 0;
  },

  getResources: function()
  {
    let selector = `[${this.selectors.resource}]`;

    // legacy support:
    if (this.selectors.legacy) { selector += `,[${this.selectors.legacy}]`; }

    let toWatch = DOM.getAll(selector);
    return toWatch;
  },

  setupScrollHandler()
  {
    this.scrollHandler = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollHandler);

    this.loadedHandler = this.onResourceLoaded.bind(this);
  },

  onScroll()
  {
    if (true === this.checking) { return; }

    setTimeout(this.checkView.bind(this), 200); // debounced.
    this.checking = true;
  },

  addToWatch(elements)
  {
    this.watching = elements.map(this.prepareLazloItem);
    this.watchCount = this.watching.length;
  },

  prepareLazloItem: function(item)
  {
    DOM.addClass(Lazlo.selectors.watching, item);
    return item;
  },

  checkView()
  {
    this.viewPort = DOM.viewDims();
    let waiting = [];

    let remaining = this.watching.filter(element => {
      return !(this.isWithinView(element) && waiting.push(element));
    });

    this.watching = remaining;
    this.checking = false;

    if (true === Lazlo.devMode)
    {
      console.log(
        'Lazlo status: watchCount: %s, waiting: %s, remaining: %s', this.watchCount, waiting.length, remaining.length
      );
    }

    if (this.watchCount === this.loaded.length) { this.standDown(); }

    if (!waiting.length) { return; }
    this.processLoading(waiting);
  },

  isWithinView(element)
  {
    let dims = DOM.viewDims(element);

    // is element visible (width and height) and within the view:
    return  0 < dims.width &&
            //0 < dims.height &&
            dims.top <= this.viewPort.height &&
            dims.bottom >= 0;
  },

  processLoading(elements)
  {
    let selectors = this.selectors;
    this.rwdImages = []; // reset for counting

    elements.forEach(element => {
      DOM.addClass(selectors.loading, element);

      let resource = element.getAttribute(selectors.resource) ||
          (selectors.legacy && element.getAttribute(selectors.legacy));
      if (!resource) { return; }

      if ('noscript' === resource)
      {
        this.processNoscriptLoading(element);
      } else {
        this.processElementLoading(element, resource);
      }
    });

    if (0 < this.rwdImages.length && window.picturefill)
    {
      window.picturefill({ elements: this.rwdImages, reevaluate: true });
    }
  },

  processNoscriptLoading: function(element)
  {
    const noscript = element.querySelector('noscript');
    if (!noscript) { return; }

    const content = noscript.textContent;
    noscript.insertAdjacentHTML('beforebegin', content);
    
    let rwdImages = DOM.getAll('img[srcset], picture img', element);
    if (rwdImages) { this.rwdImages = this.rwdImages.concat(rwdImages); }

    this.setAsLoaded(element);
  },

  processElementLoading(element, resource)
  {
    let selectors = this.selectors;
    let attr =  element.getAttribute(selectors.resourceAttr) ||
                selectors.defaultAttr;

    if (selectors.defaultAttr === attr)
    {
      element.addEventListener('load', this.loadedHandler);
    }

    element.setAttribute(attr, resource);

    if (selectors.defaultAttr === attr && DOM.tagIs('img', element))
    {
      this.prepareSrcSet(element);
    } else {
      this.setAsLoaded(element);
    }
  },

  prepareSrcSet(element)
  {
    let attr = 'data-srcset';
    let srcSet = element.getAttribute(attr);
    let sources = [element];

    if (!srcSet)
    {
      let parent = DOM.parent(element, 'image');
      if (!parent) { return; }
      sources = DOM.getAll(`source[${attr}]`, parent);
      if (!sources) { return; }
    }
    
    sources.forEach(source => {
      source.setAttribute('srcset', source.getAttribute(attr));
      source.removeAttribute(attr);
    });

    this.rwdImages.push(element);
  },

  onResourceLoaded(e)
  {
    let element = e.target;

    element.removeEventListener('load', this.loadedHandler);
    this.setAsLoaded(element);

    //if (DOM.tagIs('img', element)) { this.removeImageDims(element); }
  },

  setAsLoaded(element)
  {
    let selectors = this.selectors;

    DOM.removeClass(selectors.loading, element);
    element.removeAttribute(selectors.resource);
    element.removeAttribute(selectors.resourceAttr);

    if (selectors.legacy) { element.removeAttribute(selectors.legacy); }

    DOM.addClass(selectors.loaded, element);
    this.loaded.push(element);

    const parent = DOM.parent(element);
    if (parent) { DOM.addClass(selectors.completed, parent); }
  },

  removeImageDims(element)
  {
    if (!DOM.hasAttr('data-dims', element)) { return; }

    element.removeAttribute('data-dims');
    element.removeAttribute('height');
  },

  standDown()
  {
    window.removeEventListener('scroll', this.scrollHandler);
    this.scrollHandler = null;
    this.loadedHandler = null;
    
    if (true === Lazlo.devMode) { console.log('Lazlo has stood down.'); }
  }
};

export default Lazlo
