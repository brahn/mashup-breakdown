/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, safeLogger */

// ===============================
// CONTROLS

var Controls = (function () {

  var PLAYBACK_INTERVAL_IN_MS = 50;

  var bufferIndicator,
      positionIndicator,
      timeleft,
      manualSeek = false,
      areControlsSetup = false;

  // We track duration and currentTime for indicators separately from
  // YouTube, because we may want to use or update controls before YouTube
  // has loaded, or when Youtube is not advancing.

  var duration,
      currentTime;

  var updateBufferIndicator = function () {
    var byteStatus = YouTube.byteStatus();
    if (!byteStatus.total || byteStatus.total < 0) {
      bufferIndicator.hide();
      return;
    }
    var bufferStart = 1.0 * byteStatus.startingAt / byteStatus.total;
    var bufferEnd = Math.min(1.0,
      1.0 * (byteStatus.startingAt + byteStatus.loaded) / byteStatus.total);
    bufferIndicator.css("left", Math.round(100 * bufferStart) + "%");
    bufferIndicator.css("right", Math.round(100 * (1 - bufferEnd)) + "%");
    bufferIndicator.show();
  };

  var updatePlaybackIndicators = function () {
    if (!duration) {
      return;
    }
    // text indicating time remaining
    var time = currentTime || 0,
        rem = parseInt(duration - time, 10),
        pos = (time / duration) * 100,
        mins = Math.floor(rem / 60, 10),
        secs = rem - mins * 60;
    timeleft.text('-' + mins + ':' + (secs < 10 ? '0' + secs : secs));
    // adjust position indicator if we aren't in the midst of a manual drag
    if (!manualSeek) {
      positionIndicator.css({
        left: pos + '%'
      });
    }
  };

  var setupPositionControl = function () {
    if (!duration) {
      return;
    }
    $('.player #gutter').slider({
      value: 0,
      step: 0.01,
      orientation: "horizontal",
      range: "min",
      max: duration,
      animate: false,
      slide: function (e, ui) {
        manualSeek = true;
        Visualizer.setTime(ui.value);
      },
      stop: function (e, ui) {
        manualSeek = false;
        YouTube.seekTo(ui.value);
      }
    });
    $(".player #handle-tail").height(16 + $('#samples').height()).
       css("opacity", 0.5).show();
  };

  var setupPlayToggle = function () {
    // change play toggle when youtube player state changes
    YouTube.onStateChange.push(function () {
      if (YouTube.isPlaying()) {
        $("#playtoggle").addClass('playing');
      } else {
        $("#playtoggle").removeClass('playing');
      }
    });
    // clicking play toggle changes state of youtube player
    $("#playtoggle").click(function () {
      if (YouTube.isPlaying()) {
        YouTube.pause();
      } else {
        YouTube.play();
      }
    });
  };

  var setupControls = function (suppliedDuration) {

    duration = suppliedDuration;

    if (areControlsSetup) {
      $('.player #gutter').slider("option", "max", duration);
    } else {
      // stash common elements
      bufferIndicator = $('.player #buffer');
      positionIndicator = $('.player #handle');
      timeleft = $('.player #timeleft');

      setupPlayToggle();
      setupPositionControl();
      updatePlaybackIndicators();

      setInterval(function () {
        updateBufferIndicator();
        if (YouTube.isPlaying()) {
          currentTime = YouTube.currentTime();
          updatePlaybackIndicators();
          Visualizer.setTime(currentTime);
        }
      }, PLAYBACK_INTERVAL_IN_MS);
      areControlsSetup = true;
    }

  };

  return {
    setup: setupControls
  };

}());

