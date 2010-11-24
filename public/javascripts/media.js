/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, SCloud */

// interface for multiple types of media

// calls YouTube and SCloud javascript objects as appropriate.

var MediaPlayer = (function () {

  var MEDIA_TYPES = ["sc", "yt"];

  var m_players = {}, // player objects, usually DOM nodes of flash widgets
      m_currentType,
      m_currentAlbum;

  return {
    setup: setup,

    isCreated: isCreated,
    isPlaying: isPlaying,

    play: play,
    pause: pause,
    seekTo: seekTo,
    setVolume: setVolume,
    mute: mute,
    unmute: unmute

    // XXX
    // Deal with buffering

    // XXX
    // choose track
    // advance track on transition
    // In YT this is just setting tracks, but SC can handle sequences of
    // tracks (perhaps for gapless playback) so not completely clear what
    // to do just yet

  };


}());