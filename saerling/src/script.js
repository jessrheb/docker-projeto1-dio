'use strict';

/* STICKY NAV */

const nav = document.querySelector('nav');
const supportPageOffset = window.scrollX !== undefined;
const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';

let previousScrollPosition = 0;

const isScrollingDown = () => {
  let scrolledPosition = supportPageOffset
    ? window.scrollY
    : isCSS1Compat
    ? document.documentElement.scrollTop
    : document.body.scrollTop;
  let isScrollDown;

  if (scrolledPosition > previousScrollPosition) {
    isScrollDown = true;
  } else {
    isScrollDown = false;
  }
  previousScrollPosition = scrolledPosition;
  return isScrollDown;
};

const handleNavScroll = () => {
  if (isScrollingDown() && !nav.contains(document.activeElement)) {
    nav.classList.add('scroll-down');
    nav.classList.remove('scroll-up');
  } else {
    nav.classList.add('scroll-up');
    nav.classList.remove('scroll-down');
  }
};

let throttleTimer;

const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

window.addEventListener('scroll', () => {
  if (mediaQuery && !mediaQuery.matches) {
    throttle(handleNavScroll, 250);
  }
});

const debounce = (fn) => {
  let frame;
  return (...params) => {
    if (frame) {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(() => {
      fn(...params);
    });
  };
};

const storeScroll = () => {
  document.documentElement.dataset.scroll = window.scrollY;
};

document.addEventListener('scroll', debounce(storeScroll), { passive: true });

storeScroll();

/* ICON CHANGE */

const innerIcon = document.querySelector('.inner-icon');

function varyIcon() {
  const number = Math.floor(Math.random() * 10) + 1;
  const image = innerIcon.querySelector('img');

  image.src =
    number <= 5
      ? image.src.replace('icon-2', 'icon-1')
      : image.src.replace('icon-1', 'icon-2');
}

document.addEventListener('click', varyIcon);

/* TABS */

const tabs = document.querySelectorAll('.tab');
const tabsContainer = document.querySelector('.internal');
const tabsContent = document.querySelectorAll('.section-content');

tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.tab');
  if (!clicked) return;
  tabs.forEach((tab) => tab.classList.remove('tab--active'));
  tabsContent.forEach((content) => content.classList.remove('active-content'));
  clicked.classList.add('tab--active');
  document
    .querySelector(`.section-content--${clicked.dataset.tab}`)
    .classList.add('active-content');
});

/* DIAGRAM INTERACTION */

const diagram = document.querySelector('.venn-diagram');

function diagramInteractivity(event) {
  const classes = event.target
    .closest('.venn-diagram > div[data-area]')
    ?.classList.value.split(' ')
    .join(', .');

  const elements = document.querySelectorAll(`.${classes}`);
  elements.forEach((element) => {
    if (event.type === 'mouseover') element.classList.add('light-up');
    if (event.type === 'mouseout') element.classList.remove('light-up');
  });
}

diagram.addEventListener('mouseover', diagramInteractivity);
diagram.addEventListener('mouseout', diagramInteractivity);
