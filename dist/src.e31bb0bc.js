// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../../Users/root/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../Users/root/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../Users/root/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/bundle-url.js"}],"styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../Users/root/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/css-loader.js"}],"recorder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Recorder = void 0;
const ErrorAlert = {
  NotSupports: 'Sorry, your browser does not support screen capture',
  NotAllowedScreen: 'Please enable screen capture',
  NotAllowedMic: 'You did not allow access to the microphone',
  RecordingError: 'There was an error while recording, recording was stopped',
  Unknown: 'Unknown error'
};

class Recorder extends EventTarget {
  constructor() {
    super();
    this.alertEl = document.getElementById('alert-message');
  }

  async start({
    enableDesktopAudio = false,
    enableMicAudio = false
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

    this.desktopStream.addEventListener('inactive', e => {
      this.stop();
    });

    if (enableMicAudio) {
      this.voiceStream = await this.getVoiceStream();
    }

    const tracks = [...this.desktopStream.getVideoTracks(), ...this.mergeAudioStreams(this.desktopStream, this.voiceStream)];
    this.active = true;
    this.stream = new MediaStream(tracks); // videoElement.srcObject = stream;
    // videoElement.muted = true;

    this.recorder = this.initMediaRecorder(this.stream);
    this.recorder.start(10);
  }

  stop() {
    this.hideAlert();
    this.stopRecording();
  }

  stopRecording() {
    if (this.recorder == null) {
      return;
    }

    this.active = false;

    if (this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }

    this.recorder = null;
    this.stopStream(this.stream);
    this.stopStream(this.voiceStream);
    this.stopStream(this.desktopStream);
    this.stream = null;
    this.voiceStream = null;
    this.desktopStream = null;
    this.recording = window.URL.createObjectURL(new Blob(this.chunks, {
      type: 'video/webm; codecs=vp8'
    }));
    this.dispatchEvent(new CustomEvent('stop', {
      detail: this.recording
    }));
  }

  stopStream(stream) {
    if (!stream) {
      return;
    }

    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  async getDesktopStream(enableAudio) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: enableAudio
      });
      return stream;
    } catch (err) {
      if (this.isNotAllowedError(err)) {
        this.showAlert(ErrorAlert.NotAllowedScreen, true);
      } else {
        this.showAlert(ErrorAlert.Unknown, true);
      }

      return null;
    }
  }

  async getVoiceStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      });
      return stream;
    } catch (err) {
      if (this.isNotAllowedError(err)) {
        this.showAlert(ErrorAlert.NotAllowedMic, false);
      } else {
        this.showAlert(ErrorAlert.Unknown, true);
      }

      return null;
    }
  }

  initMediaRecorder(stream) {
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });
    recorder.addEventListener('dataavailable', event => {
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
    if (navigator.mediaDevices?.getDisplayMedia === undefined) {
      return false;
    }

    return navigator.mediaDevices?.getUserMedia !== undefined;
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

exports.Recorder = Recorder;
},{}],"index.js":[function(require,module,exports) {
'use strict';

require("./styles.css");

var _recorder = require("./recorder");

function toggleButton(btnEl, enable) {
  btnEl.disabled = !enable;
}

document.addEventListener("DOMContentLoaded", function (event) {
  const rec = new _recorder.Recorder();
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
  });
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
},{"./styles.css":"styles.css","./recorder":"recorder.js"}],"../../../../../Users/root/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61221" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../Users/root/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map