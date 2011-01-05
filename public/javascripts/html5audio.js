/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, sendEvent */

// HTML5 AUDIO
// For the most part, just a convenient wrapper

var Html5Audio = (function () {

  var audioPlayer = null;

// ===========================================
// DETECT SUPPORT
// Following http://diveintohtml5.org/everything.html

  var isSupported = function () {
    return !!document.createElement('audio').canPlayType;
  };

  var isTypeSupported = function (audioType) {
    var a = document.createElement('audio');
    var typeStr = null;
    switch (audioType) {
    case 'mp3':
      typeStr = 'audio/mpeg';
      break;
    case 'ogg':
      typeStr = 'audio/ogg; codecs="vorbis"';
      break;
    case 'wav':
      typeStr = 'audio/wav; codecs="1"';
      break;
    case 'aac':
      typeStr = 'audio/mp4; codecs="mp4a.40.2"';
      break;
    }
    if (!typeStr) {
      safeLogger("Don't know how to check for audio type '" + audioType + "'");
      return false;
    }
    return !!(a.canPlayType && a.canPlayType(typeStr).replace(/no/, ''));
  };

// ============================================
// MONITORING STATE OF PLAYER

  var monitorPlayerSetup = function (failureFunc) {
    safeLogger("Setup monitoring not yet implemented");
    // XXX implement
    /*
    safeLogger("Attempting to set up Html5 audio player");
    setTimeout(function () {
      if (!audioPlayer) {
        safeLogger("Failed to set up Html5 audio player");
        failureFunc();
      }
    }, 5000);
    */
  };

// ===========================
// PLAYBACK STATUS AND CALLBACKS

  var onReady = [],
      onTrackChanged = [],
      onStateChanged = [];

  var firstReady = true,
      audioState = null;

  var isCreated = function () {
    // XXX WRONG?
    return !!audioPlayer;
  };

  var bindEvents = function () {
    $(audioPlayer).bind("canplay", function (event, data) {
      if (firstReady) {
        sendEvent(onReady);
        firstReady = false;
      }
      sendEvent(onTrackChanged);
    });
    $(audioPlayer).bind("play", function () {
      audioState = "playing";
      sendEvent(onStateChanged, "playing");
    });
    $(audioPlayer).bind("pause", function () {
      audioState = "paused";
      sendEvent(onStateChanged, "paused");
    });
    $(audioPlayer).bind("ended", function () {
      audioState = "ended";
      sendEvent(onStateChanged, "ended");
    });
  };

  var state = function () {
    return audioState;
  };

  var isPlaying = function () {
    return audioPlayer ? (audioState === "playing") : undefined;
  };

  var currentTime = function () {
    return audioPlayer ? audioPlayer.currentTime : undefined;
  };

  var duration = function () {
    return audioPlayer ? audioPlayer.duration : undefined;
  };

// ======================================================
// PLAYER SET UP


  // Creates the audio player object
  // options object can take the following fields (defaults)
  // * srcUrl ("http://www.archive.org/download/testmp3testfile/mpthreetest.mp3"")
  //     url of track to be cued, default track is mostly harmless
  // * divToReplace ($("#audio-player-standin"));
  // * playerObjectId ("audio-player")
  // * playWhenCued (false)
  // * failureCallback (null function)
  // * controls (false)
  var setup = function (options) {
    var opts = $.extend({ // defaults
      srcUrl: "http://www.archive.org/download/testmp3testfile/mpthreetest.mp3",
      divToReplace: $("#audio-player-standin"),
      playerObjectId: "audio-player",
      playWhenCued: false,
      failureCallback: function () {},
      controls: false
    }, options);
    if (!audioPlayer) {
      // player hasn't been created yet, so we need to set it up
      // First, check for support
      if (!isSupported()) {
        return;
      }
      // create the player
      opts.divToReplace = $(opts.divToReplace);
      audioPlayer = document.createElement('audio');
      $(audioPlayer).attr('id', opts.playerObjectId).
        attr('controls', opts.controls ? 'controls' : '').
        width(opts.divToReplace.width()).
        height(opts.divToReplace.height());
      // setup callbacks
      bindEvents();
      opts.divToReplace.replaceWith(audioPlayer);
      monitorPlayerSetup();
    }
    // attempt to load and (if requested) play
    if (opts.playWhenCued) {
      loadByUrl(opts.srcUrl);
    } else {
      cueByUrl(opts.srcUrl);
    }
  };



// =================================
// QUEUEING

  var cueByUrl = function (srcUrl) {
    if (audioPlayer && srcUrl) {
      $(audioPlayer).attr("autoplay", "");
      audioPlayer.setAttribute('src', srcUrl);
      audioPlayer.load();
    }
  };

  // cue and play when ready
  var loadByUrl = function (srcUrl) {
    if (audioPlayer && srcUrl) {
      $(audioPlayer).attr("autoplay", "autoplay");
      audioPlayer.setAttribute('src', srcUrl);
      audioPlayer.load();
    }
  };


// ==================================
// PLAYER CONTROLS

  var play = function () {
    if (audioPlayer) {
      audioPlayer.play();
    }
  };

  var pause = function () {
    if (audioPlayer) {
      audioPlayer.pause();
    }
  };

  var seekTo = function (seconds) {
    if (audioPlayer) {
      audioPlayer.currentTime = seconds;
    }
  };


// =================================
// PLAYER VOLUME

  // Volume is a float (!)
  var setVolume = function (volume) {
    if (isNaN(volume) || volume < 0 || volume > 1) {
      safeLogger("Volume must be a float between 0 and 1");
      return;
    } else if (audioPlayer) {
      audioPlayer.volume = volume;
    }
  };

  var savedVolume = null;

  var mute = function () {
    if (audioPlayer) {
      savedVolume = audioPlayer.volume;
      setVolume(0);
    }
  };

  var unMute = function () {
    if (audioPlayer) {
      setVolume(savedVolume || 0.5);
    }
  };


// ========================
// BUFFERING

  // XXX Seems like not many browsers have implemented buffering progress
  // XXX yet, and there may be some disagreement among them, etc.
  // XXX So, YMMV!


  var bufferStatus = function () {
    if (!audioPlayer || !audioPlayer.buffered || !audioPlayer.duration ||
      audioPlayer.buffered.length == 0) {
      return {};
    }
    return {
      fractionBuffered: (audioPlayer.buffered.end(0) - audioPlayer.buffered.start(0)) / audioPlayer.duration,
      fractionStartingAt: audioPlayer.buffered.start(0) / audioPlayer.duration
    };
  };


// ========================

  return {
    isSupported: isSupported,
    isTypeSupported: isTypeSupported,

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

