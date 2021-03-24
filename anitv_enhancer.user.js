// ==UserScript==
// @name         Anitv Enhancer (script)
// @namespace    https://github.com/U-cauda-elongata
// @version      0.2.5
// @updateURL    https://raw.githubusercontent.com/U-cauda-elongata/anitv-enhancer/master/anitv_enhancer.user.js
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

  (function episodesList() {
    if (!location.pathname.startsWith('/episodes')) return;

    const episodeId = Number.parseInt(location.pathname.match(/^\/episodes\/(\d+)/)[1], 10);

    document.querySelector('#episode-detail > .movie-content-note').insertAdjacentHTML(
      'afterend',
      '<div class="user-uce-episodes-container"><div id="user-uce-episodes"></div></div>'
    );
    const title = document.querySelector('#episode-detail .bc-block > a:nth-of-type(2)');

    fetch('/api/v1' + title.pathname, {
      headers: new Headers({'User-Agent': 'anitv iosapp 999'})
    })
      .then(res => res.json())
      .then(json => {
        const episodes = json.episodes;

        const div = document.getElementById('user-uce-episodes');
        div.style.color = json.text_color;

        episodes.forEach(e => {
          div.insertAdjacentHTML('beforeend', `\
<a class="content-cell-common content-cell content-table episode-ccc" href="/episodes/${e.id}">\
<div class="ccc-image content-tc"><img src="${e.thumbnail_url}" loading="lazy"><div class="ccc-play"></div></div>\
<div class="ccc-text content-tc">\
<ul class="guide cfx"><li></li></ul>\
<div class="ccc-text-bl2 ellipsis2">${e.name}</div>\
<div class="ccc-text-sl1">${e.episode_display_num}</div>\
</div>\
</a>`
          );
        });

        const i = episodes.findIndex(e => e.id === episodeId);
        if (i !== -1) {
          const cellWidth = div.firstChild.scrollWidth;
          div.style.width = `${cellWidth * episodes.length}px`;
          const container = div.parentElement;
          // Move the current episode to the center.
          container.scrollLeft = (cellWidth * (i * 2 + 1) - container.offsetWidth) / 2;
        }
      });
  })();

  (function keyboardShortcuts() {
    const FPS = 30; // This is just an assumption

    const play = document.getElementById('player-ctrl-play');
    const prev = document.getElementById('player-ctrl-prev-ep');
    const next = document.getElementById('player-ctrl-next-ep');
    const fullscreen = document.getElementById('player-ctrl-full-screen');
    const fullscreenOff = document.getElementById('player-ctrl-full-screen-off');
    const mute = document.getElementById('player-ctrl-sound-on');
    const unmute = document.getElementById('player-ctrl-sound-off');

    const vjs = videojs('player-embed-videoid');

    let playbackRate = 1;

    function setPlaybackRate(r) {
      vjs.playbackRate(playbackRate = Math.min(Math.max(r, 0.25), 2));
    }

    if (play) play.addEventListener('click', () => vjs.playbackRate(playbackRate));

    vjs.ready(() => document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.ctrlKey || e.metaKey) return;

      switch (e.key) {
        // Toggle play/pause
        case ' ':
          e.preventDefault();
          // fall-through
        case 'K': case 'k':
          if (vjs.paused()) {
            if (play) {
              play.click();
            } else {
              vjs.play();
            }
          } else {
            vjs.pause();
          }
          break;
        // Rewind 10 seconds
        case 'J': case 'j':
          vjs.currentTime(vjs.currentTime() - 10);
          break;
        // Rewind 2.5 seconds
        case 'ArrowLeft':
          e.preventDefault();
          vjs.currentTime(vjs.currentTime() - 2.5);
          break;
        // Fast forward 10 seconds
        case 'L': case 'l':
          vjs.currentTime(vjs.currentTime() + 10);
          break;
        // Fast forward 2.5 seconds
        case 'ArrowRight':
          e.preventDefault();
          vjs.currentTime(vjs.currentTime() + 2.5);
          break;
        // Previous video
        case 'P':
          if (prev.href !== '#') prev.click();
          break;
        // Next video
        case 'N':
          if (next.href !== '#') next.click();
          break;
        // Previous frame (while paused)
        case ',':
          if (vjs.paused()) {
            vjs.currentTime((vjs.currentTime() * FPS - 1) / FPS);
          }
          break;
        // Next frame (while paused)
        case '.':
          if (vjs.paused()) {
            vjs.currentTime((vjs.currentTime() * FPS + 1) / FPS);
          }
          break;
        // Decrease playback rate
        case '<':
          setPlaybackRate(playbackRate - 0.25);
          break;
        // Increase playback rate
        case '>':
          setPlaybackRate(playbackRate + 0.25);
          break;
        // Seek to specific point in the video (7 advances to 70% of duration)
        case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
          vjs.currentTime(vjs.duration() * e.key / 10);
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
          if (vjs.muted()) {
            unmute.click();
          } else {
            mute.click();
          }
          break;
        }
      })
    );
  })();

  (function theaterModeButton() {
    const b = document.createElement('button');
    b.classList.add('user-uce-theater-toggle');
    b.innerHTML = '<svg viewBox="0 0 18 18"><rect fill="none" stroke-width="2" x="1" y="1" width="16" height="16" /></svg>';
    b.addEventListener('click', e => {
      e.stopPropagation();
      toggleTheater();
    });
    document.querySelector('.player-ctrl-bottom').appendChild(b);
  })();
})();
