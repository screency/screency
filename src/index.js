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
  const webcamSwitch = document.getElementById('webcam-switch');
  const picInPicWebcamSwitch = document.getElementById('pinp-switch');
  const videoEl = document.getElementById('video-out');
  const webcamVideoEl = document.getElementById('webcam');

  let pictureInPictureActive = false;
  let pictureInPictureEnabled = false;
  let active = false;
  let ready = false;

  const requestPictureInPicture = () => {
    webcamVideoEl.requestPictureInPicture().catch(err => {
      console.error('picture in picture request failed:', err);
      pictureInPictureActive = true;
    })
  }

  startBtn.addEventListener('click', () => {
    pictureInPictureEnabled = !!picInPicWebcamSwitch.checked;
    rec.start({
      enableDesktopAudio: desktopAudioSwitch.checked,
      enableMicAudio: micSwitch.checked,
      enableWebcam: webcamSwitch.checked,
      picInPic: picInPicWebcamSwitch.checked,
    });
  });

  stopBtn.addEventListener('click', () => {
    rec.stop();
  })

  downloadBtn.addEventListener('click', event => {
    if (active || !ready) {
      event.preventDefault();
    }
  });

  rec.addEventListener('start', (event) => {
    toggleButton(startBtn, false);
    toggleButton(stopBtn, true);
    active = true;

    if (pictureInPictureEnabled) {
      // if pic-in-pic mode enabled, starts streaming to video element
      if (event.detail) {
        // webcam enabled
        webcamVideoEl.muted = true;
        webcamVideoEl.srcObject = event.detail;
      }

      webcamVideoEl.addEventListener('loadedmetadata', () => {
        webcamVideoEl.style.opacity = 1;
      });
    }
  })

  rec.addEventListener('stop', event => {
    if (event.detail) {
      videoEl.src = event.detail;
      downloadBtn.href = event.detail;
      ready = true;
      active = false;
    } else {
      ready = false;
      active = false;
    }

    toggleButton(startBtn, true);
    toggleButton(stopBtn, false);

    downloadBtn.classList.remove('btn-disabled');
    webcamVideoEl.style.opacity = 0;

    if (pictureInPictureActive) {
      document.exitPictureInPicture()
        .then(() => {
          pictureInPictureActive = false;
        })
        .catch(err => {
          console.error('exit picture in picture failed:', err);
        })
    }
  });

  webcamVideoEl.addEventListener('enterpictureinpicture', () => {
    webcamVideoEl.style.opacity = 0;
    pictureInPictureActive = true;
  });

  webcamVideoEl.addEventListener('leavepictureinpicture', () => {
    pictureInPictureActive = false;
    if (active) {
      webcamVideoEl.style.opacity = 1;
    }
  });

  webcamVideoEl.addEventListener('dblclick', () => {
    requestPictureInPicture();
  })
});