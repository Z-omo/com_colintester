/**
 * Module to handle input and control of RWD frame views.
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

import DOM from './dom-man.js';

const RWDView = {
  viewModes:  ['rwd-mobile', 'rwd-tablet', 'rwd-desktop'],

  selectors:  {
    container:  'rwd-view',
    controls:   'rwd-view-controls',
    active:     'active',
    device:     'rwd-device',
    frame:      'rwd-view-frame',
    index:      'data-index',
    frameURL:   'data-src'
  },

  setup(container) {
    RWDView.container = container;
    setupViewControls();
    //setupView();
  },
};

function buildViewControls(container)
{
  let controls = document.createElement('div');
  DOM.addClass(RWDView.selectors.controls, controls);

  RWDView.viewModes.forEach((mode, index) =>
  {
    let button = document.createElement('button');
    setButtonText(mode, button);
    button.setAttribute('data-index', index);
    DOM.add(button, controls);

    if (DOM.hasClass(mode, container)) { activateControl(button); }
  });

  DOM.prepend(controls, container);
}

function setupViewControls()
{
  RWDView.container.forEach((view) => {
    buildViewControls(view);
    setupRWDTitle(view);
    view.addEventListener('click', onSelectControl);
  });
}

function setButtonText(text, button)
{
  text = text.replace('rwd-', '');
  text = text.toLowerCase().replace(/\b[a-z]/g, function(letter)
  {
    return letter.toUpperCase();
  });
  button.innerHTML = text;
}

function onSelectControl(e)
{
  let control = e.target;
  if ('button' !== control.tagName.toLowerCase()) { return; }

  e.stopPropagation();
  let modeIndex = Number(control.getAttribute(RWDView.selectors.index));

  //let view = getViewContainer(control);
  let view = DOM.parent(control, RWDView.selectors.container);
  if (view) { setViewMode(view, modeIndex); }
  activateControl(control);
}

function activateControl(control)
{
  if (RWDView.activeControl)
  {
    DOM.removeClass(RWDView.selectors.active, RWDView.activeControl);
  }

  DOM.addClass(RWDView.selectors.active, control);
  RWDView.activeControl = control;
}

function setupRWDTitle(view)
{
  let box = DOM.parent(view, 'boxed');
  if (!box) { return; }

  let hilite = box.querySelector('.hilite');
  if (!hilite) { return; }
  
  hilite.textContent = '3';
  box.querySelector('.plural').textContent= 's';
}

function setViewMode(view, index)
{
  let mode = RWDView.viewModes[index];
  if (!mode) { return; }

  resetViewMode(view);
  DOM.addClass(mode, view);
}

function resetViewMode(view)
{
  RWDView.viewModes.forEach(function(mode)
  {
    if (DOM.hasClass(mode, view)) { DOM.removeClass(mode, view); }
  });
}

// function buildFrame(element)
// {
//   let device = getViewDevice(element);
//   if (!device) { device = element; }

//   let frame = document.createElement('iframe');
//   DOM.add(frame, device);
//   DOM.addClass(RWDView.selectors.frame, frame);

//   return frame;
// }

// function getViewDevice(view) {
//   return view.querySelector('.' + RWDView.selectors.device);
// }

// @TODO: rewrite so that element passed could be identified as container.

// function getViewFrame(element)
// {
//   let frame = element.querySelector('.' + RWDView.selectors.frame);
//   //if (!frame) { frame = buildFrame(element); }
//   return frame;
// }


// function setupView()
// {
//   RWDView.container.forEach(function(view) {
//     let frame = getViewFrame(view);
//     if (!frame) { return; }

//     console.log('frame: ', frame);
//     let barWidth = frame.offsetWidth - frame.clientWidth;
//     console.log('barWidth: ', barWidth);

//     if (0 < barWidth)
//     {
//       let device = getViewDevice(view);
//       if (!device) { return; }

//       let frameWidth = 100 * ((frame.offsetWidth + barWidth) / device.offsetWidth);
//       //frame.setAttribute('style', 'width: ' + frameWidth + '%;');
//     }
//     // let url = view.getAttribute(RWDView.selectors.frameURL);
//     // if (!url) { return; }
    
//     // frame.setAttribute('src', url);    
//   });
//}

// function setMobileAgent(targetWindow)
// {
//   let agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1';
//   if (agent === targetWindow.parent.navigator.userAgent) { return; }

//   let agentProp = { get: function(){ return agent; }};

//   try {
//     Object.defineProperty(targetWindow.parent.navigator, 'userAgent', agentProp);
//   } catch (e) {
//     targetWindow.parent.navigator = Object.create(navigator, { userAgent: agentProp });
//   }
//}

export default RWDView
