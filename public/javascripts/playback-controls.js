/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, asPercentage, secToMmss */
/*global YouTube, Visualizer, Album, MediaPlayer */

var PlaybackControls = (function () {

// ==============================
// PLAYBACK CONTROLS

  var bufferIndicator,
      positionIndicator,
      handleTimePoint,
      handleTimeText,
      timeleft,
      manualSeek = false,
      arePlaybackControlsSetup = false;

  // We track duration and currentTime for indicators separately from
  // MediaPlayer, because we may want to use or update controls before
  // MediaPlayer has loaded, or when MediaPlayer is not advancing.

  var duration,
      currentTime;

  var updateBufferIndicator = function () {
    var bufferStatus = MediaPlayer.getBufferStatus();
    if (!bufferStatus || !bufferStatus.fractionBuffered) {
      bufferIndicator.hide();
      return;
    }
    var bufferStart = Math.max(0.0, bufferStatus.fractionStartingAt);
    var bufferEnd = Math.min(1.0, bufferStatus.fractionBuffered +
      bufferStatus.fractionStartingAt);
    bufferIndicator.css("left", asPercentage(bufferStart));
    bufferIndicator.css("right", asPercentage(1 - bufferEnd));
    bufferIndicator.show();
  };

  var updateTimeLeft = function (time) {
    timeleft.text(secToMmss(time) + "/" + secToMmss(duration));
  };

  var updatePlaybackIndicators = function () {
    if (!duration) {
      return;
    }
    // text indicating time remaining
    updateTimeLeft(currentTime);
    // adjust position indicator if we aren't in the midst of a manual drag
    if (!manualSeek) {
      var pos =
      positionIndicator.css({
        left: asPercentage((currentTime || 0.0) / duration)
      });
    }
  };

  var setupHandleTimePoint = function () {
    handleTimePoint = $("#handle-time-point").addClass("tipsy-static").
      html('<div class="tipsy-inner" id="handle-time-text"></div>').
      css("opacity", 0.8);
    handleTimeText = $("#handle-time-text").html("0:00");
    $("#handle").mousedown(function () {
      handleTimePoint.show();
    });
  };
  $(document).ready(setupHandleTimePoint);

  var setHandleTailHeight = function () {
    $(".player #handle-tail").height(29 + $('#samples').height());
  };

  var setupPositionControl = function () {
    if (!duration) {
      return;
    }
    $('.player #gutter').slider({
      value: 0,
      step: 0.01,
      orientation: "horizontal",
      range: false,
      max: duration,
      animate: false,
      slide: function (e, ui) {
        manualSeek = true;
        handleTimePoint.show();
        handleTimeText.html(secToMmss(ui.value));
        Visualizer.setTime(ui.value);
        if (!MediaPlayer.isPlaying()) {
          updateTimeLeft(ui.value);
        }
      },
      stop: function (e, ui) {
        manualSeek = false;
        handleTimePoint.stop().fadeOut("fast");
        currentTime = ui.value;
        MediaPlayer.seekTo(ui.value);
      }
    });
    setHandleTailHeight();
    $(".player #handle-tail").css("opacity", 0.5).show();
  };

  var attemptPlayToggle = function () {
    if (MediaPlayer.isPlaying()) {
      MediaPlayer.pause();
    } else if (MediaPlayer.isCreated()) {
      MediaPlayer.play();
    } else {
      // check again in 1.5 second
      setTimeout(function () {
        if (MediaPlayer.isCreated()) {
          // It worked this time!  Play it.
          MediaPlayer.play();
        } else {
          // Problem.  Show it.
          $('#media-error-dialog').dialog("open");
        }
      }, 1500);
    }
  };

  var spaceTogglesPlay = true;

  var setSpaceTogglesPlay = function (val) {
    spaceTogglesPlay = !!val;
  };

  var setupPlayToggle = function () {
    // change play toggle when youtube player state changes
    MediaPlayer.onStateChanged.push(function () {
      if (MediaPlayer.isPlaying()) {
        $("#playtoggle").addClass('playing');
      } else {
        $("#playtoggle").removeClass('playing');
      }
    });
    // clicking play toggle changes state of media player
    $("#playtoggle").click(attemptPlayToggle);
    // pressing space also toggles state of mediaPlayer
    $(document).keydown(function (event) {
      if (event.which === 32 && spaceTogglesPlay) {
        attemptPlayToggle();
      }
    });
  };

  var setPlaybackDuration = function (suppliedDuration) {
    duration = suppliedDuration;
    currentTime = 0;
    if (arePlaybackControlsSetup) {
      $('.player #gutter').slider("option", "max", duration);
      updatePlaybackIndicators();
    } else {
      // stash common elements
      bufferIndicator = $('.player #buffer');
      positionIndicator = $('.player #handle');
      timeleft = $('.player #timeleft');

      setupPlayToggle();
      setupPositionControl();
      updatePlaybackIndicators();
      arePlaybackControlsSetup = true;
    }
  };
  MediaPlayer.onTimeChanged.push(function () {
    if (!arePlaybackControlsSetup) {
      return;
    }
    updateBufferIndicator();
    currentTime = MediaPlayer.getTime();
    updatePlaybackIndicators();
  });

  var refreshPlaybackControls = function () {
    setPlaybackDuration(Album.get("tracks")[MediaPlayer.getTrackIndex()].duration);
  };

  MediaPlayer.onTrackChanged.push(refreshPlaybackControls);
  Album.onDataChanged.push(refreshPlaybackControls);

  $(document).ready(function () {
    $(window).resize(function () {
      waitForFinalEvent(setHandleTailHeight, WINDOW_RESIZE_CALLBACK_DELAY,
        "setHandleTailHeight");
    });
  });

  var isManuallySeeking = function () {
    return manualSeek;
  };

  return {
    isManuallySeeking: isManuallySeeking,
    setSpaceTogglesPlay: setSpaceTogglesPlay
  };

}());

