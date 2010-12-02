/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, swfobject, sendEvent, soundcloud */

// SOUND CLOUD PLAYER
// For the most part, just a convenient wrapper for
// https://github.com/soundcloud/Widget-JS-API/wiki

var SCloud = (function () {

  var scPlayer = null;

// ============================================
// MONITORING STATE OF PLAYER

/*
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

*/

// ======================================================
// PLAYER SET UP



/*
  var ytIdToCue = null,
      ytPlayWhenCued = null;
*/

  var setup = function (divToReplace, playerObjectId, ytId, playWhenCued,
    createPlayerFailureFunc) {
/*
    if (isCreated()) {
      // player has already been created, we don't need to do it again
      if (playWhenCued) {
        load(ytId);
      } else {
        cue(ytId);
      }
      return;
    }
*/
    // create the player
    divToReplace = $(divToReplace);
    playerObjectId = playerObjectId || "scPlayer";
/*
    ytIdToCue = ytId || "Srmdij0CU1U";
    ytPlayWhenCued = playWhenCued;
*/
    var playerWidth = divToReplace.width(),
        playerHeight = divToReplace.height();
    var flashvars = {
      enable_api: true,
      object_id: playerObjectId,
      url: "http://soundcloud.com/forss/flickermood"
    };
    var params = {
      allowscriptaccess: "always",
      wmode: "transparent"
    };
    var attributes = {
      id: playerObjectId,
      name: playerObjectId
    };
    swfobject.embedSWF("http://player.soundcloud.com/player.swf",
      divToReplace.attr("id"), playerWidth, playerHeight, "9.0.0",
      "expressInstall.swf", flashvars, params, attributes);
/*
    monitorYouTubeSetup(createPlayerFailureFunc);
*/
  };

  // callback arrays

  var onReady = [];
/*
  var onStateChange = [];

  var doOnStateChange = function (state) {
    sendEvent(onStateChange, state);
  };

  // This function must be defined (and globally available, I guess.)
  // It is called by youtube magic.
*/

  $(document).bind('soundcloud:onPlayerReady', function (event, data) {
    scPlayer = document.getElementById("sc-player");
/*
    ytPlayer.addEventListener("onError", "YouTube.onError");
    ytPlayer.addEventListener("onStateChange", "YouTube.doOnStateChange");
    if (ytPlayWhenCued) {
      load(ytIdToCue);
    } else {
      cue(ytIdToCue);
    }
*/
    sendEvent(onReady);
/*
    logInfo();
*/
  });

// ================================
// VIDEO DISPLAY

/*
  var resize = function (width, height) {
    if (ytPlayer) {
      ytPlayer.width = width;
      ytPlayer.height = height;
    }
  };
*/

// =================================
// QUEUEING VIDEO

/*
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

*/

// ==================================
// PLAYER CONTROLS

  var play = function () {
    if (scPlayer) {
      scPlayer.api_play();
    }
  };

  var pause = function () {
    if (scPlayer) {
      scPlayer.api_pause();
    }
  };

  // https://github.com/soundcloud/Widget-JS-API/wiki
  // Jump to a certain position in a track. Before seeking, please
  // make sure that the track is fully buffered. The widget will
  // trigger a onMediaDoneBuffering event when it’s fully available.
  var seekTo = function (seconds) {
    if (scPlayer) {
      scPlayer.seekTo(seconds);
    }
  };


// =================================
// PLAYER VOLUME

  // Volume is an integer from 0-100
  var setVolume = function (volume) {
    if (isNaN(volume) || volume < 0 || volume > 100) {
      safeLogger("Volume must be an integer between 0 and 100");
      return;
    } else if (scPlayer) {
      scPlayer.api_setVolume(volume);
    }
  };

  var savedVolume = null;

  var mute = function () {
    if (scPlayer) {
      savedVolume = scPlayer.api_getVolume();
      scPlayer.api_setVolume(0);
    }
  };

  var unMute = function () {
    if (scPlayer) {
      scPlayer.api_setVolume(savedVolume || 50);
    }
  };


// ========================
// PLAYBACK STATUS

/*
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


*/
  var isCreated = function () {
    return !!scPlayer;
  };

/*
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
*/

// ========================

  return {
/*
    logInfo: logInfo,
    resize: resize,
    cue: cue,
    cueByUrl: cueByUrl,
    load: load,
    loadByUrl: loadByUrl,
*/
    play: play,
    pause: pause,
    seekTo: seekTo,
    setVolume: setVolume,
    mute: mute,
    unMute: unMute,
    setup: setup,
/*
    onYouTubePlayerReady: onYouTubePlayerReady,
    byteStatus: byteStatus,
    state: state,
*/
    isCreated: isCreated,
/*
    isPlaying: isPlaying,
    currentTime: currentTime,
    duration: duration,
    videoUrl: videoUrl,

    // callback arrays
*/
    onReady: onReady
/*
    onStateChange: onStateChange,

    // listeners for ytPlayer events, need to be globally available
    doOnStateChange: doOnStateChange,
    onError: onError
*/
  };

}());

/*
// This function must be defined (and globally available.)
// It is called by youtube magic.
var onYouTubePlayerReady = YouTube.onYouTubePlayerReady;

*/

$(document).ready(function () {
  soundcloud.debug = true;
  SCloud.setup($("#sc-player-standin"), "sc-player", "", null, function () {
    safeLogger("soundcloud FAIL");
  });
});

