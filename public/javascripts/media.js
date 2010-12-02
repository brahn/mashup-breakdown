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
  var onAlbumSetup = [],
      onTrackChanged = [],
      onStateChanged = [];

  YouTube.onReady.push(function () {
    if (m_album.mediaType === "youtube") {
      sendEvent(onAlbumSetup);
      sendEvent(onTrackChanged);
    }
  });
  // XXX need to do the same for SC

  YouTube.onStateChanged.push(function () {
    if (m_album.mediaType === "youtube") {
      sendEvent(onStateChanged);
    }
  });
  // XXX need to do the same for SC

// =============================================================
// ALBUM SETUP

  // Initialize player with specified album.
  // options can carry the following optional fields (defaults in parens)
  // * playWhenCued (default)
  // * failureCallback (null function)
  // * startAtTrack (0)
  // * startAtTime (0) XXX not yet implemented
  var setupAlbum = function (album, newOptions) {
    var opts = $.extend({
      playWhenCued: false, // defaults
      failureCallback: function () {},
      startAtTrack: 0,
      startAtTime: 0
    }, newOptions);
    m_album = album;
    m_trackIndex = opts.startAtTrack;
    switch (m_album.mediaType) {
    case "youtube":
      YouTube.setup($("#yt-player-standin"), "ytPlayer",
        m_album.tracks[opts.startAtTrack].ytId, opts.playWhenCued,
          opts.failureCallback);
      break;
    case "soundcloud":
      SCloud.setup($("#sc-player-standin"), "scPlayer",
        m_album.tracks[opts.startAtTrack].scUrl, opts.playWhenCued,
        opts.failureCallback);
      break;
    default:
      safeLogger("bad album source type: ");
      safeLogger(album.source);
    }
  };

// =================================================
// CHANGING TRACKS

  // manual transition

  var gotoTrack = function (trackIndex, playImmediately) {
    switch (m_album.mediaType) {
    case "youtube":
      YouTube.setup($("#yt-player-standin"), "ytPlayer",
        m_album.tracks[trackIndex].ytId,
        playImmediately, function () {
          $('#media-error-dialog').dialog("open");
        });
      break;
    case "soundcloud":
      // XXX TO DO
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
  // XXX need to do the same for SoundCloud

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
      // XXX TO DO
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
    switch (m_album.mediaType) {
    case "youtube":
      return YouTube.currentTime();
      break;
    case "soundcloud":
      // XXX
      break;
    }
    return null;
  };

  var getBufferStatus = function () {
    switch (m_album.mediaType) {
    case "youtube":
      return YouTube.byteStatus();
      break;
    case "soundcloud":
      // XXX
      break;
    }
    return {};
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
    onStateChanged: onStateChanged

    // XXX
    // Deal with buffering

  };


}());

// Test data

/*
var ytAlbum = {};
SampleData.getAlbum("wikipedia", function (results) {
  ytAlbum.tracks = results;
  ytAlbum.sourceType = "youtube";
});

var scAlbum = {
  artist: "Girl Talk",
  title: "All Day",
  sourceType: "soundcloud",
  tracks: [{
    title: "Oh No",
    scUrl: "http://soundcloud.com/user5904919/01-girl-talk-oh-no"
  }, {
    title: "Let It Out",
    scUrl: "http://soundcloud.com/user5904919/02-girl-talk-let-it-out"
  }, {
    title: "That's Right",
    scUrl: "http://soundcloud.com/user5904919/03-girl-talk-thats-right"
  }]
};
*/