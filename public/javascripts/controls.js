/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, asPercentage, secToMmss */
/*global YouTube, Visualizer, AlbumData, MediaPlayer */

var Controls = (function () {

// ==============================
// PLAYBACK CONTROLS

  var PLAYBACK_INTERVAL_IN_MS = 50;

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
    var byteStatus = YouTube.byteStatus();
    if (!byteStatus.total || byteStatus.total < 0) {
      bufferIndicator.hide();
      return;
    }
    var bufferStart = 1.0 * byteStatus.startingAt / byteStatus.total;
    var bufferEnd = Math.min(1.0,
      1.0 * (byteStatus.startingAt + byteStatus.loaded) / byteStatus.total);
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
    $(".player #handle-tail").height(24 + $('#samples').height());
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
    $("#playtoggle").click(function () {
      if (MediaPlayer.isPlaying()) {
        MediaPlayer.pause();
      } else if (MediaPlayer.isCreated()) {
        MediaPlayer.play();
      } else {
        // check again in 1 second
        setInterval(function () {
          if (MediaPlayer.isCreated()) {
            // It worked this time!  Play it.
            MediaPlayer.play();
          } else {
            // Problem.  Show it.
            $('#media-error-dialog').dialog("open");
          }
        }, 1000);
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

      setInterval(function () {
        updateBufferIndicator();
        if (MediaPlayer.isPlaying()) {
          currentTime = MediaPlayer.getTime();
          updatePlaybackIndicators();
          Visualizer.setTime(currentTime, true);
        }
      }, PLAYBACK_INTERVAL_IN_MS);
      arePlaybackControlsSetup = true;
    }
  };
  MediaPlayer.onTrackChanged.push(function () {
    setPlaybackDuration(MediaPlayer.getTrack().duration);
  });

  $(document).ready(function () {
    $(window).resize(setHandleTailHeight);
  });

// ================================
// TRACK SELECTOR

  var isTrackSelectorSetup = false;

  var setTrackOptions = function (tracks) {
    $('#track-select').html($('#track-option-template').
      tmpl({tracks: tracks})).val(0);
    if (!isTrackSelectorSetup) {
      $('#track-select').change(function () {
        MediaPlayer.gotoTrack($(this).val());
      });
    }
  };
  // callback to update selector on track change
  MediaPlayer.onTrackChanged.push(function () {
    $('#track-select').val(MediaPlayer.getTrackIndex());
  });

// ================================
// DATA SOURCE SELECTOR

  var m_sampleDataSources = [];

  var findSourceById = function (sourceId) {
    for (var i = 0; i < m_sampleDataSources.length; i += 1) {
      if (m_sampleDataSources[i].id === sourceId) {
        return m_sampleDataSources[i];
      }
    }
    return null;
  };

  var setDataSource = function (sourceId, forceReload) {
    $('#data-source-select').val(sourceId);
    $('#data-source-reload-link-container').hide();
    $('#data-source-label-text').hide();
    $('#data-source-loading-indicator').show();
    AlbumData.setSource(findSourceById(sourceId), forceReload);

  };
  // callback to change in data source, which results from setDataSource
  AlbumData.onDataChanged.push(function () {
    $('#data-source-loading-indicator').hide();
    $('#data-source-label-text').show();
    if (AlbumData.getSource().id === "wikipedia-live") {
      $('#data-source-reload-link-container').show();
    } else {
      $('#data-source-reload-link-container').hide();
    }
  });

  var isDataSourceSelectorSetup = false;

  var setDataSourceOptions = function (sources) {
    m_sampleDataSources = sources;
    $('#data-source-select').html($('#data-option-template').
      tmpl(m_sampleDataSources)).
      val(m_sampleDataSources[0].id);
    if (!isDataSourceSelectorSetup) {
      // set up selector
      $('#data-source-select').change(function () {
        setDataSource($(this).val(), false);
      });
      // set up reload link
      $('#data-source-reload-link').click(function () {
        setDataSource($('#data-source-select').val(), true);
      });
      isDataSourceSelectorSetup = true;
    }
    // when setting new data source options, go get the first data source
    setDataSource(m_sampleDataSources[0].id);
  };


// =================================================

  var setupAlbum = function (album) {
    setDataSourceOptions(album.sampleDataSources);
    setTrackOptions(album.tracks);
  };

  return {
    setupAlbum: setupAlbum
  };

}());

