'use strict';

import './styles.css'

import { Recorder } from './recorder';

function toggleButton(btnEl, enable) {
  btnEl.disabled = !enable;
}

document.addEventListener("DOMContentLoaded", function (event) {
  const rec = new Recorder();
  const startBtn = document.getElementById('btn-start');
  const stopBtn = document.getElementById('btn-stop');
  const downloadBtn = document.getElementById('btn-download');
  const micSwitch = document.getElementById('mic-switch');
  const desktopAudioSwitch = document.getElementById('desktop-audio-switch');
  const videoEl = document.getElementById('video-out');
  let active = false;
  let ready = false;

  startBtn.addEventListener('click', () => {
    rec.start({
      enableDesktopAudio: desktopAudioSwitch.checked,
      enableMicAudio: micSwitch.checked
    });

    toggleButton(startBtn, false);
    toggleButton(stopBtn, true);
    active = true;
  });

  stopBtn.addEventListener('click', () => {
    rec.stop();
  })

  downloadBtn.addEventListener('click', event => {
    if (active || !ready) {
      event.preventDefault();
    }
  });

  rec.addEventListener('stop', event => {
    videoEl.src = event.detail;
    downloadBtn.href = event.detail;
    ready = true;
    active = false;

    toggleButton(startBtn, true);
    toggleButton(stopBtn, false);

    downloadBtn.classList.remove('btn-disabled');
  });
});