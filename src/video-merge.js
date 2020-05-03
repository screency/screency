export class VideoMerge {
  constructor() {
    this.canvas = document.getElementById('merge-canvas');
    this.context = this.canvas.getContext('2d');
    this.webcamVideo = document.getElementById('vm-webcam');
    this.displayVideo = document.getElementById('vm-display');
    this.webcamRatio = 0.2; // relative to width
    this.webcamMargin = 10;
    this.isStopped = true;

    this.setFPS(60);
    this.setCanvasSize(800, 600);

    this.displayVideo.addEventListener('loadedmetadata', () => {
      this.displayVideo.play();
    });
    this.webcamVideo.addEventListener('loadedmetadata', () => {
      this.webcamVideo.play();
    });
  }

  start() {
    this.isStopped = false;
    this.draw();
    this.stream = this.canvas.captureStream(this.fps);

    return this.stream;
  }

  stop() {
    this.isStopped = true;
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.stopVideo(this.displayVideo);
    this.stopVideo(this.webcamVideo);
    if (this.stream) {
      this.stream.getVideoTracks().forEach(track => {
        track.stop();
      });
    }
  }

  /**
   * 
   * @param {MediaStream} stream 
   */
  addWebcam(stream) {
    this.webcamVideo.srcObject = stream;

    const settings = this.getStreamSettings(stream);
    if (settings) {
      this.webcamHeight = this.webcamWidth / settings.ratio;
      this.webcamRadius = this.webcamHeight / 2;
      this.webcamXOffset = -(this.webcamWidth - this.webcamHeight) / 2;
      this.webcamY = this.canvasHeight - this.webcamHeight - this.webcamMargin;
    }
  }

  addDisplay(stream) {
    this.displayVideo.srcObject = stream;

    const settings = this.getStreamSettings(stream);
    if (settings) {
      this.setCanvasSize(settings.width, settings.height);
      this.fps = settings.fps;
    }
  }

  draw() {
    if (this.isStopped) {
      return;
    }

    this.context.drawImage(this.displayVideo, 0, 0, this.canvasWidth, this.canvasHeight);
    this.drawInCircle();

    setTimeout(this.draw.bind(this), 1000 / this.fps);
  }

  drawInCircle() {
    if (!this.webcamRadius) {
      return;
    }

    this.context.save();
    this.context.beginPath();
    this.context.arc(
      this.webcamRadius + this.webcamMargin,
      this.webcamY + this.webcamRadius,
      this.webcamRadius,
      0,
      Math.PI * 2,
      true
    );
    this.context.closePath();
    this.context.clip();

    this.context.drawImage(
      this.webcamVideo,
      this.webcamXOffset + this.webcamMargin,
      this.webcamY,
      this.webcamWidth,
      this.webcamHeight
    );

    this.context.restore();
  }

  getStreamSettings(stream) {
    const tracks = stream.getVideoTracks();
    if (tracks.length === 0) {
      console.error('can\'t get stream settings')
      return null;
    }

    const firstTrackSettings = tracks[0].getSettings();
    return {
      ratio: firstTrackSettings.aspectRatio,
      fps: firstTrackSettings.frameRate,
      width: firstTrackSettings.width,
      height: firstTrackSettings.height,
    }
  }

  setCanvasSize(width, height) {
    this.canvasHeight = height;
    this.canvasWidth = width;

    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;

    this.webcamWidth = this.canvasWidth * this.webcamRatio;
  }

  setFPS(val) {
    if (val < 25 || val > 60) {
      this.fps = 60;
    } else {
      this.fps = val;
    }
  }

  stopVideo(videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.srcObject = null;
  }
}