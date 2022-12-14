/**!
 * Focus app – Initiator/Client Control for colintester.com
 *
 * @package     OnFocus
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
import Lazlo from './Lazlo';
import RWDView from './rwd-view';

const focus = {
  view: {
    smallViewEM:    39,
    scrolledClass:  'js-scrolled'
  },

  init() {
    setViewParams();
    setJSMode();    
    focus.view.smallView && setupMobileMenu();
    !focus.view.home && setupHeaderTitle();
    setupEvents();
    setupLazyLoad();
    !focus.view.smallView && setupRWDViews();
  }
}

export default focus

function setViewParams() {
  let boundary = document.querySelector('.boundary');
  if (!boundary) { return; }

  let compStyle = window.getComputedStyle(boundary);
  let regexNumeric = /^\d+/;
  let vpWidth = Number(regexNumeric.exec(compStyle.width));
  let vpFontSize = Number(regexNumeric.exec(compStyle.fontSize));
  let vpMobileMax = focus.view.smallViewEM * vpFontSize;

  focus.view.smallView = vpWidth < vpMobileMax;
  focus.view.home = DOM.hasClass('home', DOM.body);
}

function setJSMode() {
  DOM.addClass('focus-js', DOM.html);
}

function setupMobileMenu() {
  let nav = document.querySelector('#menu');
  if (!nav) { return; }

  let menu = document.createElement('span');
  nav.appendChild(menu);
  menu.id = 'menuBtn';
  menu.addEventListener(
    'click', () => DOM.toggleClass('open', focus.view.nav)
  );

  focus.view.nav = nav;
}

function setupHeaderTitle() {
  console.log('setupHeaderTitle');
  // find main content title:
  const t = document.querySelector('main > h1');
  if (!t) { return; }

  // update header title:
  const ht = document.querySelector('.boundary > header h2');
  if (!ht) { return; }

  ht.innerHTML = t.innerHTML;
}

function setupEvents() {
  window.addEventListener('scroll', onScroll);
}

function onScroll() {
  if (!focus.view.scrolling) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(requestScrollCheck);
    } else {
      setTimeout(requestScrollCheck, 200);
    }
  }

  focus.view.scrolling = true;
}

function requestScrollCheck() {
  setScrollState();
  focus.view.scrolling = false;
}

function setScrollState() {
  let scroll = window.pageYOffset;

  if (0 === scroll) {
    DOM.removeClass(focus.view.scrolledClass, DOM.html);
    focus.view.scrolled = false;
    return;
  }

  if (!focus.view.scrolled) {
    DOM.addClass(focus.view.scrolledClass, DOM.html);
  }
  
  focus.view.scrolled = true;
}

function setupLazyLoad() {
  let toLoad = DOM.getAll('[data-lazlo]');
  if (!toLoad) { return; }

  Lazlo.watch(toLoad);
}

function setupRWDViews() {
  let rwd = DOM.getAll('.rwd-view');
  if (!rwd) { return; }

  RWDView.setup(rwd, focus.view.smallView);
}
