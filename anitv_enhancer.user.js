// ==UserScript==
// @name         Anitv Enhancer (script)
// @namespace    https://github.com/U-cauda-elongata
// @version      0.1.0
// @updateURL    https://github.com/U-cauda-elongata/anitv-enhancer/blob/master/anitv_enhancer.user.js
// @description  YouTube-like keyboard shortcuts and theater mode for Anitele.
// @author       Yu Onaga
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://ch.ani.tv/episodes/*
// @match        https://ch.ani.tv/channels/*
// @match        https://ch.ani.tv/live-broadcasts/*
// @grant        none
// ==/UserScript==

(() => {
  function toggleTheater() {
    document.body.classList.toggle('user-uce-theater');
  }

  (function keyboardShortcuts() {
    const player = document.getElementById('player-embed-videoid');
    const play = document.getElementById('player-ctrl-play');
    const prev = document.getElementById('player-ctrl-prev-ep');
    const next = document.getElementById('player-ctrl-next-ep');
    const fullscreen = document.getElementById('player-ctrl-full-screen');
    const fullscreenOff = document.getElementById('player-ctrl-full-screen-off');
    const pause = document.getElementById('player-ctrl-pause');
    const mute = document.getElementById('player-ctrl-sound-on');
    const unmute = document.getElementById('player-ctrl-sound-off');
    const volumeBar = document.getElementById('player-ctrl-sound-prog');

    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.ctrlKey || e.metaKey) return;

      switch (e.key) {
        // Toggle play/pause
        case ' ':
          e.preventDefault();
          // fall-through
        case 'K': case 'k':
          if (player.classList.contains('vjs-playing')) {
            pause.click();
          } else {
            play.click();
          }
          break;
        // Previous video
        case 'P':
          if (prev.href !== '#') prev.click();
          break;
        // Next video
        case 'N':
          if (next.href !== '#') next.click();
          break;
        // Toggle full screen
        case 'F': case 'f':
          if (document.fullscreenElement) {
            fullscreenOff.click();
          } else {
            fullscreen.click();
          }
          break;
        // Toggle theater mode
        case 'T': case 't':
          toggleTheater();
          break;
        // Toggle mute
        case 'M': case 'm':
          if (volumeBar.style.width === '0px') {
            unmute.click();
          } else {
            mute.click();
          }
          break;
      }
    });
  })();

  (function theaterModeButton() {
    const b = document.createElement('button');
    b.classList.add('user-uce-theater-toggle');
    b.innerHTML = '<svg><rect fill="none" stroke-width="2" x="1" y="1" width="16" height="16" /></svg>';
    b.addEventListener('click', e => {
      e.stopPropagation();
      toggleTheater();
    });
    document.querySelector('.player-ctrl-bottom').appendChild(b);
  })();
})();
