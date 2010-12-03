/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, swfobject, sendEvent, soundcloud */

// SOUND CLOUD PLAYER
// For the most part, just a convenient wrapper for
// https://github.com/soundcloud/Widget-JS-API/wiki

var SCloud = (function () {

  var scPlayer = null;

// ============================================
// MONITORING STATE OF PLAYER

  var monitorPlayerSetup = function (failureFunc) {
    safeLogger("Attempting to embed SoundCloud player");
    setTimeout(function () {
      if (!scPlayer) {
        safeLogger("Failed to embed Soundcloud player");
        failureFunc();
      }
    }, 5000);
  };

// ======================================================
// PLAYER SET UP

  var scPlayWhenCued = false,
      scPlayerObjectId = null;

  // Creates the soundcloud flash object.
  // options object can take the following fields (defaults)
  // * scUrl ("http://soundcloud.com/forss/flickermood") -- url of track
  //     to be cued, default track is mostly harmless
  // * divToReplace ($("#sc-player-standin"));
  // * playerObjectId ("sc-player")
  // * playWhenCued (false)
  // * failureCallback (null function)
  var setup = function (options) {
    var opts = $.extend({ // defaults
      scUrl: "http://soundcloud.com/forss/flickermood",
      divToReplace: $("#sc-player-standin"),
      playerObjectId: "sc-player",
      playWhenCued: false,
      failureCallback: function () {}
    }, options);
    if (scPlayer) {
      // player has already been created, we don't need to do it again
      if (opts.playWhenCued) {
        loadByUrl(opts.scUrl);
      } else {
        cueByUrl(opts.scUrl);
      }
      return;
    }
    // create the player
    opts.divToReplace = $(opts.divToReplace);
    scPlayWhenCued = opts.playWhenCued;
    scPlayerObjectId = opts.playerObjectId;
    var playerWidth = opts.divToReplace.width(),
        playerHeight = opts.divToReplace.height();
    var flashvars = {
      enable_api: true,
      object_id: opts.playerObjectId,
      url: opts.scUrl
    };
    var params = {
      allowscriptaccess: "always",
      wmode: "transparent"
    };
    var attributes = {
      id: opts.playerObjectId,
      name: opts.playerObjectId
    };
    swfobject.embedSWF("http://player.soundcloud.com/player.swf",
      opts.divToReplace.attr("id"), playerWidth, playerHeight, "9.0.0",
      "expressInstall.swf", flashvars, params, attributes);
    monitorPlayerSetup(opts.failureCallback);
  };

  // callback arrays

  var onReady = [],
      onTrackChanged = [];

  var firstReady = true;
  $(document).bind('soundcloud:onPlayerReady', function (event, data) {
    if (!scPlayer) {
      scPlayer = document.getElementById("sc-player");
    }
    if (firstReady) {
      sendEvent(onReady);
      firstReady = false;
    }
    sendEvent(onTrackChanged);
    if (scPlayWhenCued) {
      play();
    }
  });

// =================================
// QUEUEING

  var cueByUrl = function (scUrl) {
    if (scPlayer) {
      scPlayWhenCued = false;
      scPlayer.api_load(scUrl);
    }
  };

  // cue and play when ready
  var loadByUrl = function (scUrl) {
    if (scUrl) {
      scPlayWhenCued = true;
      scPlayer.api_load(scUrl);
    }
  };


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
// BUFFERING

  var bufferPercentLoaded = null;

  $(document).bind('soundcloud.onMediaBuffering', function (player, data) {
    bufferPercentLoaded = data.percent;
  });

  var bufferStatus = function () {
    return {
      percentLoaded: bufferPercentLoaded
    };
  };

// ===========================
// PLAYBACK STATUS

  var onStateChanged = [];

  var isCreated = function () {
    return !!scPlayer;
  };

  var scState = null;
  $(document).bind("soundcloud:onMediaPlay", function () {
    scState = "playing";
    sendEvent(onStateChanged);
  });
  $(document).bind("soundcloud:onMediaPause", function () {
    scState = "paused";
    sendEvent(onStateChanged);
  });
  $(document).bind("soundcloud:onMediaEnd", function () {
    scState = "ended";
    sendEvent(onStateChanged);
  });

  var state = function () {
    return scState;
  };

  var isPlaying = function () {
    return scPlayer ? (scState === "playing") : undefined;
  };

  var currentTime = function () {
    return scPlayer ? scPlayer.api_getTrackPosition() : undefined;
  };

  var duration = function () {
    return scPlayer ? scPlayer.api_getTrackDuration() : undefined;
  };


// ========================

  return {
    setup: setup,
    cueByUrl: cueByUrl,
    loadByUrl: loadByUrl,
    play: play,
    pause: pause,
    seekTo: seekTo,
    setVolume: setVolume,
    mute: mute,
    unMute: unMute,

    isCreated: isCreated,
    isPlaying: isPlaying,
    bufferStatus: bufferStatus,
    state: state,
    currentTime: currentTime,
    duration: duration,

    // callback arrays
    onReady: onReady,
    onStateChanged: onStateChanged,
    onTrackChanged: onTrackChanged
  };

}());

/*

$(document).ready(function () {
  soundcloud.debug = true;
  SCloud.setup($("#sc-player-standin"), "sc-player", "", null, function () {
    safeLogger("soundcloud FAIL");
  });
});

*/