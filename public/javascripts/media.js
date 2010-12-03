/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, SCloud, sendEvent, safeLogger */

// interface for multiple types of media
// calls YouTube and SCloud javascript objects as appropriate.

var MediaPlayer = (function () {

  var MEDIA_SOURCE_TYPES = ["soundcloud", "youtube"];

  var m_controllerObjs = {
    soundcloud: SCloud,
    youtube: YouTube
  };

  var m_album, m_trackIndex; // currently playing album, track number

// =====================================
// CALLBACKS

  // Callback functions
  var onTimeChanged = [],
      onTrackChanged = [function () {
        sendEvent(onTimeChanged);
      }],
      onAlbumSetup = [function () {
        sendEvent(onTrackChanged);
      }],
      onStateChanged = [];

  YouTube.onReady.push(function () {
    if (m_album.mediaType === "youtube") {
      sendEvent(onAlbumSetup);
    }
  });
  SCloud.onReady.push(function () {
    if (m_album.mediaType === "soundcloud") {
      sendEvent(onAlbumSetup);
    }
  });

  YouTube.onStateChanged.push(function () {
    if (m_album.mediaType === "youtube") {
      sendEvent(onStateChanged);
    }
  });
  SCloud.onStateChanged.push(function () {
    if (m_album.mediaType === "soundcloud") {
      sendEvent(onStateChanged);
    }
  });


  YouTube.onVideoChanged.push(function () {
    if (m_album.mediaType === "youtube") {
      sendEvent(onTrackChanged);
    }
  });
  SCloud.onTrackChanged.push(function () {
    if (m_album.mediaType === "soundcloud") {
      sendEvent(onTrackChanged);
    }
  });


// =============================================================
// ALBUM SETUP

  var isTimerSetup = false;

  var PLAYBACK_INTERVAL_IN_MS = 50;

  var setupTimerEvent = function () {
    setInterval(function () {
      if (isPlaying()) {
        sendEvent(onTimeChanged);
      }
    }, PLAYBACK_INTERVAL_IN_MS);
    isTimerSetup = true;
  };

  var m_failureCallback = function () {};

  // Initialize player with specified album.
  // options can carry the following optional fields (defaults in parens)
  // * playWhenCued (default)
  // * failureCallback (null function)
  // * startAtTrack (0)
  // * startAtTime (0) XXX not yet implemented
  var setupAlbum = function (album, options) {
    var opts = $.extend({
      playWhenCued: false, // defaults
      failureCallback: function () {},
      startAtTrack: 0,
      startAtTime: 0
    }, options);
    m_album = album;
    m_trackIndex = opts.startAtTrack;
    m_failureCallback = opts.failureCallback;
    switch (m_album.mediaType) {
    case "youtube":
      YouTube.setup({
        ytId: m_album.tracks[opts.startAtTrack].ytId,
        playWhenCued: opts.playWhenCued,
        failureCallback: opts.failureCallback
      });
      break;
    case "soundcloud":
      SCloud.setup({
        scUrl: m_album.tracks[opts.startAtTrack].scUrl,
        playWhenCued: opts.playWhenCued,
        failureCallback: opts.failureCallback
      });
      break;
    default:
      safeLogger("bad album source type: ");
      safeLogger(album.source);
    }
    if (!isTimerSetup) {
      setupTimerEvent();
    }
  };

// =================================================
// CHANGING TRACKS

  // manual transition

  var gotoTrack = function (trackIndex, playImmediately) {
    trackIndex = parseInt(trackIndex);
    switch (m_album.mediaType) {
    case "youtube":
      YouTube.setup({
        ytId: m_album.tracks[trackIndex].ytId,
        playWhenCued: playImmediately,
        failureCallback: m_failureCallback
      });
      break;
    case "soundcloud":
      SCloud.setup({
        scUrl: m_album.tracks[trackIndex].scUrl,
        playWhenCued: playImmediately,
        failureCallback: m_failureCallback
      });
      break;
    }
    m_trackIndex = trackIndex;
    sendEvent(onTrackChanged);
  };

  // automatic transition

  var lastAdvanceDateTime = null,
      ADVANCE_HYSTERESIS_IN_SEC = 2;

  var advanceTrack = function () {
    if (m_trackIndex < m_album.tracks.length - 1) {
      gotoTrack(m_trackIndex + 1, true);
    }
  };
  YouTube.onStateChanged.push(function (state) {
    if (state === 0) {
      var tempDateTime = new Date();
      if (!lastAdvanceDateTime || (tempDateTime - lastAdvanceDateTime) >
           ADVANCE_HYSTERESIS_IN_SEC * 1000) {
        lastAdvanceDateTime = tempDateTime;
        advanceTrack();
      }
    }
  });
  SCloud.onStateChanged.push(function (state) {
    if (state === "ended") {
      var tempDateTime = new Date();
      if (!lastAdvanceDateTime || (tempDateTime - lastAdvanceDateTime) >
           ADVANCE_HYSTERESIS_IN_SEC * 1000) {
        lastAdvanceDateTime = tempDateTime;
        advanceTrack();
      }
    }
  });


// =============================================================
// INTRA-TRACK PLAY CONTROL

  var play = function () {
    m_controllerObjs[m_album.mediaType].play();
  };
  var pause = function () {
    m_controllerObjs[m_album.mediaType].pause();
  };

  // Seek to specified point in the current track.  (Time is in seconds)
  var seekTo = function (seconds) {
    switch (m_album.mediaType) {
    case "youtube":
      if (YouTube.isPlaying()) {
        YouTube.seekTo(seconds, true);
      } else {
        YouTube.seekTo(seconds, true);
        YouTube.pause();
      }
      break;
    case "soundcloud":
      SCloud.seekTo(seconds);
      break;
    }
  };

// ==============================================================
// VOLUME

  var setVolume = function (volume) {
    m_controllerObjs[m_album.mediaType].setVolume(volume);
  };
  var mute = function () {
    return m_controllerObjs[m_album.mediaType].mute();
  };
  var unmute = function () {
    return m_controllerObjs[m_album.mediaType].unmute();
  };


// ==============================================================
// GET INFORMATION ABOUT PLAYER

  var isCreated = function () {
    return m_controllerObjs[m_album.mediaType].isCreated();
  };

  var isPlaying = function () {
    return m_controllerObjs[m_album.mediaType].isPlaying();
  };

  var getAlbum = function () {
    return m_album;
  };

  var getTrackIndex = function () {
    return m_trackIndex;
  };

  var getTrack = function () {
    if (!m_album && !m_album.tracks) {
      return null;
    }
    if (m_trackIndex >= m_album.tracks.length || m_trackIndex < 0) {
      safeLogger("trackNum out of range");
      return null;
    }
    return m_album.tracks[m_trackIndex];
  };

  var getTime = function () {
    return m_controllerObjs[m_album.mediaType].currentTime();
  };

  var getDuration = function () {
    return m_controllerObjs[m_album.mediaType].currentTime();
  };

  var getBufferStatus = function () {
    switch (m_album.mediaType) {
    case "youtube":
      var ytByteStatus = YouTube.byteStatus();
      if (ytByteStatus && !ytByteStatus.total) {
        return {
          fractionBuffered: ytByteStatus.loaded / ytByteStatus.total,
          fractionStartingAt: ytByteStatus.startingAt / ytByteStatus.total
        };
      } else {
        return {
          fractionBuffered: 0,
          fractionStartingAt: 0
        };
      }
      break;
    case "soundcloud":
      var scBufferStatus = SCloud.bufferStatus();
      if (scBufferStatus) {
        return {
          fractionBuffered: scBufferStatus.percentLoaded / 100.0,
          fractionStartingAt: 0
        };
      } else {
        return {
          fractionBuffered: 0,
          fractionStartingAt: 0
        };
      }
      break;
    }
  };

  return {
    setupAlbum: setupAlbum,
    gotoTrack: gotoTrack,

    play: play,
    pause: pause,
    seekTo: seekTo,

    setVolume: setVolume,
    mute: mute,
    unmute: unmute,

    isCreated: isCreated,
    isPlaying: isPlaying,

    getAlbum: getAlbum,
    getTrackIndex: getTrackIndex,
    getTrack: getTrack,
    getTime: getTime,
    getBufferStatus: getBufferStatus,

    onAlbumSetup: onAlbumSetup,
    onTrackChanged: onTrackChanged,
    onTimeChanged: onTimeChanged,
    onStateChanged: onStateChanged
  };


}());

