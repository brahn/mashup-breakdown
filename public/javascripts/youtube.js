/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, swfobject, sendEvent */

// YOUTUBE PLAYER
// For the most part, just a convenient wrapper with safety checks for
// http://code.google.com/apis/youtube/js_api_reference.html#Functions
//
// E.g., YT documentation sez: Always check that at least one ytPlayer
// function exists since when IE unloads the page, it will destroy the
// SWF before clearing the interval.
//
// Also, for some reason YT's event listeners insist on being passed
// globally named functions, so there is some hackery involved.

var YouTube = (function () {

  var ytPlayer = null;

// ============================================
// MONITORING STATE OF PLAYER

  var logInfo = function () {
    if (!ytPlayer) {
      safeLogger("No Youtube Player");
      return;
    }
    if (!ytPlayer.getDuration) {
      safeLogger("No YouTube Duration Info available");
      return;
    }
    safeLogger("Player Info:" +
      "\n videoDuration: " + ytPlayer.getDuration() +
      "\n videoCurrentTime: ", ytPlayer.getCurrentTime() +
      "\n bytesTotal: ", ytPlayer.getVideoBytesTotal() +
      "\n startBytes: ", ytPlayer.getVideoStartBytes() +
      "\n bytesLoaded: ", ytPlayer.getVideoBytesLoaded() +
      "\n volume: ", ytPlayer.getVolume()
    );
  };

  // This function is called when an error is thrown by the player
  var onError = function (errorCode) {
    safeLogger("A YouTube error occured of type:" + errorCode);
  };

// ======================================================
// PLAYER SET UP

  var ytIdToCue = null,
      ytPlayWhenCued = null;

  var setup = function (divToReplace, playerObjectId, ytId, playWhenCued) {
    if (isCreated()) {
      // player has already been created, we don't need to do it again
      if (playWhenCued) {
        load(ytId);
      } else {
        cue(ytId);
      }
      return;
    }
    // create the player
    divToReplace = $(divToReplace);
    playerObjectId = playerObjectId || "ytPlayer";
    ytIdToCue = ytId || "Srmdij0CU1U";
    ytPlayWhenCued = playWhenCued;
    var playerWidth = divToReplace.width(),
        playerHeight = divToReplace.height();
    var playerid = "player1"; // used by onYouTubePlayerReady function

    // allowScriptAccess lets Flash from another domain call JavaScript
    // wmode ensures that other divs can appear in front of flash object
    var params = { allowScriptAccess: "always", wmode: "transparent" };
    // The element id of the Flash embed
    var atts = { id: playerObjectId };
    // All of the magic handled by SWFObject
    // http://code.google.com/p/swfobject/
    swfobject.embedSWF("http://www.youtube.com/apiplayer?" + 
                       "enablejsapi=1&playerapiid=" + playerid,
                       divToReplace.attr("id"), playerWidth, playerHeight,
                       "8", null, null, params, atts);
  };


  // callback arrays

  var onReady = [],
      onStateChange = [];

  var doOnStateChange = function (state) {
    sendEvent(onStateChange, state);
  };

  // This function must be defined (and globally available, I guess.)
  // It is called by youtube magic.
  var onYouTubePlayerReady = function (playerid) {
    ytPlayer = document.getElementById("ytPlayer");
    ytPlayer.addEventListener("onError", "YouTube.onError");
    ytPlayer.addEventListener("onStateChange", "YouTube.doOnStateChange");
    if (ytPlayWhenCued) {
      load(ytIdToCue);
    } else {
      cue(ytIdToCue);
    }
    sendEvent(onReady);
    logInfo();
  };

// ================================
// VIDEO DISPLAY

  var resize = function (width, height) {
    if (ytPlayer) {
      ytPlayer.width = width;
      ytPlayer.height = height;
    }
  };

// =================================
// QUEUEING VIDEO


  // Loads the specified video's thumbnail and prepares the player to
  // play the video. The player does not request the FLV until
  // playVideo() or seekTo() is called.
  var cue = function (ytId) {
    if (ytPlayer) {
      ytPlayer.cueVideoById(ytId);
    }
  };

  var cueByUrl = function (ytURL) {
    if (ytPlayer) {
      ytPlayer.cueVideoByUrl(ytURL);
    }
  };

  // load and play when ready
  var load = function (ytId) {
    if (ytPlayer) {
      ytPlayer.loadVideoById(ytId);
    }
  };

  var loadByUrl = function (ytURL) {
    if (ytPlayer) {
      ytPlayer.loadVideoByUrl(ytURL);
    }
  };


// ==================================
// PLAYER CONTROLS

  var play = function () {
    if (ytPlayer) {
      ytPlayer.playVideo();
    }
  };

  var pause = function () {
    if (ytPlayer) {
      ytPlayer.pauseVideo();
    }
  };

  // http://code.google.com/apis/youtube/js_api_reference.html#Functions
  // We recommend that you set this parameter to false while the user
  // is dragging the mouse along a video progress bar and then set the
  // parameter to true when the user releases the mouse.
  var seekTo = function (seconds, allowSeekAhead) {
    if (ytPlayer) {
      ytPlayer.seekTo(seconds, allowSeekAhead);
    }
  };

// =================================
// PLAYER VOLUME

  // Volume is an integer from 0-100
  var setVolume = function (volume) {
    if (isNaN(volume) || volume < 0 || volume > 100) {
      safeLogger("Volume must be an integer between 0 and 100");
      return;
    } else if (ytPlayer) {
      ytPlayer.setVolume(volume);
    }
  };

  var mute = function () {
    if (ytPlayer) {
      ytPlayer.mute();
    }
  };

  var unMute = function () {
    if (ytPlayer) {
      ytPlayer.unMute();
    }
  };

// ========================
// PLAYBACK STATUS

  var byteStatus = function () {
    if (ytPlayer) {
      return {
        loaded: ytPlayer.getVideoBytesLoaded(),
        total: ytPlayer.getVideoBytesTotal(),
        startingAt: ytPlayer.getVideoStartBytes()
      };
    } else {
      return {};
    }
  };

  var state = function () {
    return ytPlayer ? ytPlayer.getPlayerState() : undefined;
  };

  var isCreated = function () {
    return !!ytPlayer;
  };

  var isPlaying = function () {
    return ytPlayer ? (ytPlayer.getPlayerState() === 1) : undefined;
  };

  var currentTime = function () {
    return ytPlayer ? ytPlayer.getCurrentTime() : undefined;
  };

  var duration = function () {
    return ytPlayer ? ytPlayer.getDuration() : undefined;
  };

  var videoUrl = function () {
    return ytPlayer ? ytPlayer.getVideoUrl() : undefined;
  };

// ========================

  return {
    logInfo: logInfo,
    resize: resize,
    cue: cue,
    cueByUrl: cueByUrl,
    load: load,
    loadByUrl: loadByUrl,
    play: play,
    pause: pause,
    seekTo: seekTo,
    setVolume: setVolume,
    mute: mute,
    unMute: unMute,
    setup: setup,
    onYouTubePlayerReady: onYouTubePlayerReady,
    byteStatus: byteStatus,
    state: state,
    isCreated: isCreated,
    isPlaying: isPlaying,
    currentTime: currentTime,
    duration: duration,
    videoUrl: videoUrl,

    // callback arrays
    onReady: onReady,
    onStateChange: onStateChange,

    // listeners for ytPlayer events, need to be globally available
    doOnStateChange: doOnStateChange,
    onError: onError
  };

}());

// This function must be defined (and globally available.)
// It is called by youtube magic.
var onYouTubePlayerReady = YouTube.onYouTubePlayerReady;

