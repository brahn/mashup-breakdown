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

// ==========================================
// CALLBACKS

  // Callbacks to YouTube flash object creation.  Callbacks functions take
  // no arguments.
  var onReady = [];

  // Callbacks to YouTube flash object state change.  See
  // http://code.google.com/apis/youtube/js_api_reference.html#Events
  // Callback functions take the state as the argument: possible
  // values are unstarted (-1), ended (0), playing (1), paused (2),
  // buffering (3), video cued (5).
  var onStateChanged = [];

  // Callbacks to a new video being loaded (including when player
  // becomes ready).  Note that if a video is cued, and then re-cued,
  // these callbacks still fire.
  var onVideoChanged = [];

  onStateChanged.push(function (state) {
    if (state === 5) { // videoCued
      sendEvent(onVideoChanged);
    }
  });

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

  var monitorYouTubeSetup = function (failureFunc) {
    safeLogger("Attempting to embed YouTube player");
    setTimeout(function () {
      if (!ytPlayer) {
        safeLogger("Failed to embed YouTube player");
        failureFunc();
      }
    }, 5000);
  };

// ======================================================
// PLAYER SET UP

  var ytIdToCue = null,
      ytPlayWhenCued = null,
      ytPlayerObjectId = null;

  // options object can take the following fields (defaults)
  // * ytId ("Srmdij0CU1U") -- id of video to be cued, default is test pattern
  // * divToReplace ($("#yt-player-standin"));
  // * playerObjectId ("yt-player")
  // * playWhenCued (false)
  // * failureCallback (null function)

  var setup = function (options) {
    var opts = $.extend({ // defaults
      ytId: "Srmdij0CU1U",
      divToReplace: $("#yt-player-standin"),
      playerObjectId: "yt-player",
      playWhenCued: false,
      failureCallback: function () {}
    }, options);
    if (ytPlayer) {
      // player has already been created, we don't need to do it again
      if (opts.playWhenCued) {
        load(opts.ytId);
      } else {
        cue(opts.ytId);
      }
      return;
    }
    // create the player
    opts.divToReplace = $(opts.divToReplace);
    ytPlayWhenCued = opts.playWhenCued;
    ytPlayerObjectId = opts.playerObjectId;
    ytIdToCue = opts.ytId;
    var playerWidth = opts.divToReplace.width(),
        playerHeight = opts.divToReplace.height();

    var playerid = "player1"; // used by onYouTubePlayerReady function
    // allowScriptAccess lets Flash from another domain call JavaScript
    // wmode ensures that other divs can appear in front of flash object
    var params = { allowScriptAccess: "always", wmode: "transparent" };
    // The element id of the Flash embed
    var atts = { id: opts.playerObjectId };
    // All of the magic handled by SWFObject
    // http://code.google.com/p/swfobject/
    swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
                       "enablejsapi=1&playerapiid=" + playerid,
                       opts.divToReplace.attr("id"), playerWidth, playerHeight,
                       "8", null, null, params, atts);
    monitorYouTubeSetup(opts.failureCallback);
  };

  var doOnStateChange = function (state) {
    sendEvent(onStateChanged, state);
  };

  // This function must be defined (and globally available).
  // It is called by youtube magic.
  var onYouTubePlayerReady = function (playerid) {
    ytPlayer = document.getElementById(ytPlayerObjectId);
    ytPlayer.addEventListener("onError", "YouTube.onError");
    ytPlayer.addEventListener("onStateChange", "YouTube.doOnStateChange");
    if (ytPlayWhenCued) {
      load(ytIdToCue);
    } else {
      cue(ytIdToCue);
    }
    logInfo();
    sendEvent(onReady);
    sendEvent(onVideoChanged);
  };

// ================================
// VIDEO DISPLAY

  var resize = function (width, height) {
    if (ytPlayer) {
      ytPlayer.width = width;
      ytPlayer.height = height;
    }
  };

  var resizeToContainer = function () {
    if (ytPlayer) {
      ytPlayer.width = $(ytPlayer).parent().innerWidth();
      ytPlayer.height = $(ytPlayer).parent().innerHeight();
    }
  };

// =================================
// QUEUEING VIDEO

  var onTrackChanged = [];


  // Loads the specified video's thumbnail and prepares the player to
  // play the video. The player does not request the FLV until
  // playVideo() or seekTo() is called.
  var cue = function (ytId) {
    if (ytPlayer) {
      ytPlayer.cueVideoById(ytId);
    }
  };

  var cueByUrl = function (ytUrl) {
    if (ytPlayer) {
      ytPlayer.cueVideoByUrl(ytUrl);
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
    if (!ytPlayer) {
      return {};
    }
    return {
      total: ytPlayer.getVideoBytesTotal(),
      loaded: ytPlayer.getVideoBytesLoaded(),
      startingAt: ytPlayer.getVideoStartBytes()
    };
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
    setup: setup,
    resize: resize,
    resizeToContainer: resizeToContainer,
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
    onVideoChanged: onTrackChanged,
    onStateChanged: onStateChanged,

    // listeners for ytPlayer events, need to be globally available,
    // though users shouldn't actually call them.
    doOnStateChange: doOnStateChange,
    onError: onError
  };

}());

// This function must be defined (and globally available.)
// It is called by youtube magic.
var onYouTubePlayerReady = YouTube.onYouTubePlayerReady;

