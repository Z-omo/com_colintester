/**
 * Module to handle exact dimensions of image tags.
 *
 * @package     ZLibrary
 * @author      Colin Tester <office@z-omo.com>
 * 
 * This file forms part of the installed @package and should not be copied 
 * and/or distributed without the written consent from the file's author.
 *
 * @copyright: Please see: <https://en.wikipedia.org/wiki/Berne_Convention>
 *
 * This file and its @package are under version control.
 */
"use strict";

import DOM from './dom-man';

const imgDims = {

  resizing: false,

  selectors: {
    attr: 'data-dims'
  },

  setup()
  {
    if (!this.resizeHandler)
    {
      this.resizeHandler = onResize;
      window.addEventListener('resize', this.resizeHandler);
    }
    
    processDims();
  }
};

export default imgDims;


function onResize()
{
  if (true === imgDims.resizing) { return; }
  
  setTimeout(processDims, 160); // debounced.
  imgDims.resizing = true;
}

function processDims()
{
  const images = findImages();
  if (!images || 0 === images.length) { return; }

  const imageData = getImageData(images);
  setImageDims(imageData);
  imgDims.resizing = false;
}

function findImages()
{
  const images = DOM.getAll(`img[${imgDims.selectors.attr}]`);
  return images;
}

function getImageData(imgs)
{
  const imageData = imgs.map(img => {
    let dims = getDefinedDims(img);
    if (!dims) { return; }

    addComputedDims(dims);
    return dims;
  });
  
  return imageData;
}

function getDefinedDims(img)
{
  const values = img.getAttribute(imgDims.selectors.attr).split(/\s*x\s*/i);
  if (2 !== values.length) {
    throw new Error('Image data-dims value is not defined in expected format.');
  }
  
  const dims = {
    element:   img,
    defWidth:  Number(values[0]),
    defHeight: Number(values[1])
  };

  if (isNaN(dims.defWidth) || isNaN(dims.defHeight))
  {
    throw new Error('An image data-dims value for width or height is not a number.');
  }
  return dims;
}

function addComputedDims(dims)
{
  dims.parent = DOM.parent(dims.element);
  const rect = dims.parent.getBoundingClientRect();

  dims.width = (rect.width > dims.defWidth)
    ? dims.defWidth
    : Math.round(rect.width);

  dims.ratio = Number((dims.defHeight / dims.defWidth).toFixed(2));
  dims.height = Math.floor(dims.ratio * dims.width);
}

function setImageDims(imageData)
{
  imageData.forEach(image => {
    DOM.setAttrs({
      width: image.width,
      height: image.height
    }, image.element);
  });
}
