import { VideoMerge } from './video-merge';

const ErrorAlert = {
  NotSupports: 'Sorry, your browser does not support screen capture',
  NotAllowedScreen: 'Please enable screen capture',
  NotAllowedMic: 'You did not allow access to the microphone',
  NotAllowedWebcam: 'You did not allow access to the webcam',
  WebcamNotFound: 'Webcam not found',
  RecordingError: 'There was an error while recording, recording was stopped',
  Unknown: 'Unknown error',
}

export class Recorder extends EventTarget {
  constructor() {
    super();
    this.alertEl = document.getElementById('alert-message');
    this.merger = new VideoMerge();
  }
  async start({
    enableDesktopAudio = false,
    enableMicAudio = false,
    enableWebcam = false,
    picInPic = false,
    enableWatermark = true,
  }) {
    if (!this.checkSupportAndAlert()) {
      return;
    }
    if (this.active) {
      return;
    }

    this.hideAlert();

    if (this.recording) {
      window.URL.revokeObjectURL(this.recording);
    }

    this.chunks = [];
    this.recording = null;

    this.desktopStream = await this.getDesktopStream(enableDesktopAudio);
    if (this.desktopStream === null) {
      return;
    }

    this.desktopStream.addEventListener('inactive', (e) => {
      this.stopRecording();
    });

    if (enableMicAudio) {
      this.voiceStream = await this.getVoiceStream();
    }

    let mainVideoStream = this.desktopStream;

    if (enableWebcam) {
      this.webcamStream = await this.getWebcamStream();
      if (!this.webcamStream) {
        this.stopRecording();
        return;
      }

      if (!picInPic) {
        this.merger.addDisplay(this.desktopStream);
        this.merger.addWebcam(this.webcamStream);
        mainVideoStream = this.merger.start();
      }
    }

    if (enableWatermark) {
      this.merger.enableWatermark();

      if (!this.merger.isStarted()) {
        this.merger.addDisplay(this.desktopStream);
        mainVideoStream = this.merger.start();
      }
    } else {
      this.merger.disableWatermark();
    }

    const tracks = [
      ...mainVideoStream.getVideoTracks(),
      ...this.mergeAudioStreams(this.desktopStream, this.voiceStream),
    ];
    this.active = true;
    this.stream = new MediaStream(tracks);

    this.recorder = this.initMediaRecorder(this.stream);
    this.recorder.start(10);

    this.dispatchEvent(new CustomEvent('start', { detail: picInPic ? this.webcamStream : null }));

    this.merger.start();
  }

  stop() {
    this.hideAlert();
    this.stopRecording();
  }

  stopRecording() {
    this.active = false;

    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }
    this.recorder = null;

    this.stopStream(this.stream);
    this.stopStream(this.voiceStream);
    this.stopStream(this.desktopStream);
    this.stopStream(this.webcamStream);
    this.merger.stop();

    this.stream = null;
    this.voiceStream = null;
    this.desktopStream = null;
    this.webcamStream = null;

    if (this.chunks.length) {
      this.recording = window.URL.createObjectURL(new Blob(this.chunks, { type: 'video/webm; codecs=vp8' }));
    }

    this.dispatchEvent(new CustomEvent('stop', { detail: this.recording }));
  }

  stopStream(stream) {
    if (!stream) {
      return;
    }

    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  async getDesktopStream(enableAudio) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: enableAudio });
      return stream;
    } catch (err) {
      if (this.isNotAllowedError(err)) {
        this.showAlert(ErrorAlert.NotAllowedScreen, true);
      } else {
        this.showAlert(ErrorAlert.Unknown, true);
        console.error('user display stream request failed: ', err)
      }
      return null;
    }
  }

  async getVoiceStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      return stream;
    } catch (err) {
      if (this.isNotAllowedError(err)) {
        this.showAlert(ErrorAlert.NotAllowedMic, false);
      } else {
        this.showAlert(ErrorAlert.Unknown, true);
        console.error('user voice stream request failed: ', err)
      }
      return null;
    }
  }

  async getWebcamStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      return stream;
    } catch (err) {
      if (this.isNotAllowedError(err)) {
        this.showAlert(ErrorAlert.NotAllowedWebcam, false);
      } else if (err.name === 'NotFoundError') {
        this.showAlert(ErrorAlert.WebcamNotFound, false);
      } else {
        this.showAlert(ErrorAlert.Unknown, true);
        console.error('user webcam stream request failed: ', err)
      }
      return null;
    }
  }

  initMediaRecorder(stream) {
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    });

    recorder.addEventListener('dataavailable', (event) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });
    recorder.addEventListener('onstop', () => {
      this.stopRecording();
    });
    recorder.addEventListener('onerror', () => {
      this.showAlert(ErrorAlert.RecordingError, false);
      this.stopRecording();
    });

    return recorder;
  }

  mergeAudioStreams(desktopStream, voiceStream) {
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();
    let hasDesktop = false;
    let hasVoice = false;
    if (desktopStream && desktopStream.getAudioTracks().length > 0) {
      const source = context.createMediaStreamSource(desktopStream);
      source.connect(destination);
      hasDesktop = true;
    }

    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source = context.createMediaStreamSource(voiceStream);
      source.connect(destination);
      hasVoice = true;
    }

    return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
  }

  isNotAllowedError(err) {
    return err.name === 'NotAllowedError';
  }

  checkSupportAndAlert() {
    if (this.isSupports()) {
      return true;
    }

    this.showAlert(ErrorAlert.NotSupports, false);
    this.notSupports = true;

    return false;
  }

  isSupports() {
    if (navigator.mediaDevices === undefined) {
      return false;
    }
    if (navigator.mediaDevices.getDisplayMedia === undefined) {
      return false;
    }

    return navigator.mediaDevices.getUserMedia !== undefined;
  }

  showAlert(msg, hide) {
    this.alertEl.style.display = 'block';
    this.alertEl.innerText = msg;

    if (hide) {
      setTimeout(() => {
        this.hideAlert();
      }, 3000);
    }
  }

  hideAlert() {
    this.alertEl.style.display = 'none';
  }
}