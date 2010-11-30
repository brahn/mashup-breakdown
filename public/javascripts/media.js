/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, SCloud */

// interface for multiple types of media
// calls YouTube and SCloud javascript objects as appropriate.

var MediaPlayer = (function () {

  var MEDIA_SOURCE_TYPES = ["soundcloud", "youtube"];

  var m_controllerObjs = {
        soundcloud: SCloud,
        youtube: YouTube
      };

  var m_album, m_trackNum; // currently playing album, track number

// =============================================================
// ALBUM SETUP

  // Initialize player with specified album.
  // options can carry the following optional fields (defaults in parens)
  // * playWhenCued (default)
  // * failureCallback (null function)
  // * startAtTrack (0) XXX not yet implemented
  // * startAtTime (0) XXX not yet implemented
  var setupAlbum = function (album, options) {
    m_album = album;
    switch (m_album.sourceType) {
    case "youtube":
      YouTube.setup($("#yt-player-standin"), "ytPlayer",
        m_album.tracks[0].ytId, playWhenCued, createPlayerFailureFunc);
      break;
    case "soundcloud":
      SCloud.setup($("#sc-player-standin"), "scPlayer",
        m_album.tracks[0].scUrl, playWhenCued, createPlayerFailureFunc);
      break;
    default:
      SafeLogger("bad album source type: ");
      SafeLogger(album.source);
    }
  };

// =============================================================
// INTRA-TRACK PLAY CONTROL

  var play = function () {
    m_controllerObjs[m_album.sourceType].play();
  };
  var pause = function () {
     m_controllerObjs[m_album.sourceType].pause();
  };

  // Seek to specified point in the current track.  (Time is in seconds)
  // options can carry the following optional fields (defaults in parens)
  // * allowSeekAhead (youtube-specific option)
  var seekTo = function (seconds, options) {
    options = options || {};
    if (m_album.sourceType === "youtube") {
      m_controllerObjs["youtube"].seekTo(seconds, options.allowSeekAhead);
    } else if (m_album.sourceType === "soundcloud") {
      m_controllerObjs["soundcloud"].seekTo(seconds);
    }
  };

// ==============================================================
// VOLUME

  var setVolume = function (volume) {
    m_controllerObjs[m_album.sourceType].setVolume(volume);
  };
  var mute = function () {
    return m_controllerObjs[m_album.sourceType].mute();
  };
  var unmute = function () {
    return m_controllerObjs[m_album.sourceType].unmute();
  };


// ==============================================================
// WORKING WITH ALBUMS (I.E. MULTIPLE TRACKS)

  // Get data about the currently playing album and track

  var album = function () {
    return m_album;
  };

  var trackNum = function () {
    return m_trackNum;
  };

  var track = function () {
    if (!m_album && !m_album.tracks) {
      return null;
    }
    if (m_trackNum >= m_album.tracks.length || m_trackNum < 0) {
      safeLogger("trackNum out of range");
      return null;
    }
    return m_album.tracks[m_trackNum];
  };





  // Transition to specified track in the album
  var gotoTrack = function (trackNum) {
    // XXX TO DO
    sendEvent(onTrackChange);
  };

  // Callback functions for track transititions
  var onTrackChange = [];

  // XXX need each YT and SC to manage automatic track transitions




  return {
    play: play,
    pause: pause,
    seekTo: seekTo,
    setVolume: setVolume,
    mute: mute,
    unmute: unmute,

    setupAlbum: setupAlbum,
    setTrack: setTrack,

    album: album,
    trackNum: trackNum,
    track: track,

    onAlbumSetup: onAlbumSetup,
    onTrackChange: onTrackChange

    

    // XXX
    // Deal with buffering

  };


}());

// Test data

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