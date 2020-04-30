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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NOT_SUPPORTS_ERROR = 'Sorry, your browser does not support screen capture';

var Recorder = /*#__PURE__*/function () {
  function Recorder() {
    _classCallCheck(this, Recorder);

    this.alertEl = document.getElementById('alert-message');
  }

  _createClass(Recorder, [{
    key: "start",
    value: function () {
      var _start = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var tracks;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.checkSupportAndAlert()) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                this.hideAlert();

                if (this.recording) {
                  window.URL.revokeObjectURL(this.recording);
                }

                this.chunks = [];
                this.recording = null;
                _context.next = 8;
                return this.getDesktopStream();

              case 8:
                this.desktopStream = _context.sent;

                if (!(this.desktopStream === null)) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return");

              case 11:
                this.desktopStream.addEventListener('inactive', function (e) {
                  _this.stop();
                });

                if (!this.enableMic) {
                  _context.next = 16;
                  break;
                }

                _context.next = 15;
                return this.getVoiceStream();

              case 15:
                this.voiceStream = _context.sent;

              case 16:
                tracks = [].concat(_toConsumableArray(this.desktopStream.getVideoTracks()), _toConsumableArray(this.mergeAudioStreams(this.desktopStream, this.voiceStream)));
                this.active = true;
                this.stream = new MediaStream(tracks); // videoElement.srcObject = stream;
                // videoElement.muted = true;

                this.recorder = this.initMediaRecorder(this.stream);
                this.recorder.start(10);

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: "stop",
    value: function stop() {
      this.alert.close();
      this.stopRecording();
    }
  }, {
    key: "stopRecording",
    value: function stopRecording() {
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
      this.recording = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(new Blob(this.chunks, {
        type: 'video/webm; codecs=vp8'
      })));
    }
  }, {
    key: "stopStream",
    value: function stopStream(stream) {
      if (!stream) {
        return;
      }

      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  }, {
    key: "getDesktopStream",
    value: function () {
      var _getDesktopStream = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var stream;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return navigator.mediaDevices.getDisplayMedia({
                  video: true,
                  audio: this.enableAudio
                });

              case 3:
                stream = _context2.sent;
                return _context2.abrupt("return", stream);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);

                if (this.isNotAllowedError(_context2.t0)) {
                  this.showAlert(ErrorAlert.NotAllowedScreen, true);
                } else {
                  this.showAlert(ErrorAlert.Unknown, true);
                }

                return _context2.abrupt("return", null);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function getDesktopStream() {
        return _getDesktopStream.apply(this, arguments);
      }

      return getDesktopStream;
    }()
  }, {
    key: "getVoiceStream",
    value: function () {
      var _getVoiceStream = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var stream;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return navigator.mediaDevices.getUserMedia({
                  video: false,
                  audio: this.enableMic
                });

              case 3:
                stream = _context3.sent;
                return _context3.abrupt("return", stream);

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);

                if (this.isNotAllowedError(_context3.t0)) {
                  this.showAlert(ErrorAlert.NotAllowedMic, false);
                } else {
                  this.showAlert(ErrorAlert.Unknown, true);
                }

                return _context3.abrupt("return", null);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
      }));

      function getVoiceStream() {
        return _getVoiceStream.apply(this, arguments);
      }

      return getVoiceStream;
    }()
  }, {
    key: "initMediaRecorder",
    value: function initMediaRecorder(stream) {
      var _this2 = this;

      var recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });
      recorder.addEventListener('dataavailable', function (event) {
        if (event.data && event.data.size > 0) {
          _this2.chunks.push(event.data);
        }
      });
      recorder.addEventListener('onstop', function () {
        _this2.stopRecording();
      });
      recorder.addEventListener('onerror', function () {
        _this2.showAlert(ErrorAlert.RecordingError, false);

        _this2.stopRecording();
      });
      return recorder;
    }
  }, {
    key: "mergeAudioStreams",
    value: function mergeAudioStreams(desktopStream, voiceStream) {
      var context = new AudioContext();
      var destination = context.createMediaStreamDestination();
      var hasDesktop = false;
      var hasVoice = false;

      if (desktopStream && desktopStream.getAudioTracks().length > 0) {
        var source = context.createMediaStreamSource(desktopStream);
        source.connect(destination);
        hasDesktop = true;
      }

      if (voiceStream && voiceStream.getAudioTracks().length > 0) {
        var _source = context.createMediaStreamSource(voiceStream);

        _source.connect(destination);

        hasVoice = true;
      }

      return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : [];
    }
  }, {
    key: "isNotAllowedError",
    value: function isNotAllowedError(err) {
      return err.name === 'NotAllowedError';
    }
  }, {
    key: "checkSupportAndAlert",
    value: function checkSupportAndAlert() {
      if (this.isSupports()) {
        return true;
      }

      this.showAlert(ErrorAlert.NotSupports, false);
      this.notSupports = true;
      return false;
    }
  }, {
    key: "isSupports",
    value: function isSupports() {
      var _navigator$mediaDevic, _navigator$mediaDevic2;

      if (((_navigator$mediaDevic = navigator.mediaDevices) === null || _navigator$mediaDevic === void 0 ? void 0 : _navigator$mediaDevic.getDisplayMedia) === undefined) {
        return false;
      }

      return ((_navigator$mediaDevic2 = navigator.mediaDevices) === null || _navigator$mediaDevic2 === void 0 ? void 0 : _navigator$mediaDevic2.getUserMedia) !== undefined;
    }
  }, {
    key: "showAlert",
    value: function showAlert(msg, hide) {
      var _this3 = this;

      this.alertEl.style.display = 'block';
      this.alertEl.innerText = msg;

      if (hide) {
        setTimeout(function () {
          _this3.hideAlert();
        }, 3000);
      }
    }
  }, {
    key: "hideAlert",
    value: function hideAlert() {
      this.alertEl.style.display = 'none';
    }
  }]);

  return Recorder;
}();

exports.Recorder = Recorder;
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var _recorder = require("./recorder");

function toggleButton(btnEl, enable) {
  btnEl.disabled = !enable;
}

document.addEventListener("DOMContentLoaded", function (event) {
  var rec = new _recorder.Recorder();
  var startBtn = document.getElementById('btn-start');
  var stopBtn = document.getElementById('btn-stop');
  startBtn.addEventListener('click', function () {
    rec.start();
    toggleButton(startBtn, false);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61205" + '/');

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