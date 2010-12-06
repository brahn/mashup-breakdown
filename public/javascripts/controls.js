/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, asPercentage, secToMmss */
/*global YouTube, Visualizer, AlbumData, MediaPlayer */

var Controls = (function () {

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
    setPlaybackDuration(AlbumData.getData().tracks[MediaPlayer.getTrackIndex()].duration);
  };

  MediaPlayer.onTrackChanged.push(refreshPlaybackControls);
  AlbumData.onDataChanged.push(refreshPlaybackControls);

  $(document).ready(function () {
    $(window).resize(setHandleTailHeight);
  });

// ================================
// TRACK SELECTOR

  var isTrackSelectorSetup = false;

  var trackOptionText = function (title, trackIndex) {
    if (title) {
      return "Track " + (trackIndex + 1) + " - " + title;
    } else {
      return "Track " + (trackIndex + 1);
    }
  };

  var setTrackOptions = function (tracks) {
    $('#track-select').empty();
    $.each(tracks, function (index, track) {
      $('#track-select').append('<option value="' + index + '">' +
        trackOptionText(track.title, index) + '</option>');
    });
    if (!isTrackSelectorSetup) {
      $('#track-select').change(function () {
        MediaPlayer.gotoTrack($(this).val(), MediaPlayer.isPlaying());
      });
    }
  };
  // callback to update selector on track change
  MediaPlayer.onTrackChanged.push(function () {
    $('#track-select').val(MediaPlayer.getTrackIndex());
  });

  var refreshTrackOptionText = function (tracks) {
    $.each(tracks, function (index, track) {
      $('#track-select').find('option[value=' + index + ']').
        html(trackOptionText(track.title, index));
    });
  };
  AlbumData.onDataChanged.push(function () {
    refreshTrackOptionText(AlbumData.getData().tracks);
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
    var sourceId = AlbumData.getSource().id;
    $('#data-source-select').val(sourceId);
    $('#data-source-loading-indicator').hide();
    $('#data-source-label-text').show();
    if (sourceId === "wikipedia-live") {
      $('#data-source-reload-link-container').show();
    } else {
      $('#data-source-reload-link-container').hide();
    }
  });

  var isDataSourceSelectorSetup = false;

  var setDataSourceOptions = function (sources) {
    AlbumData.clearCache();
    m_sampleDataSources = sources;
    $('#data-source-select').html($('#data-option-template').
      tmpl(m_sampleDataSources));
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
  };

// ================================================
// MISC

  var setAlbumTitle = function (album) {
    var titleStr = album.artist + " - " + album.title;
    document.title = titleStr;
    $('#page-title').text(titleStr);
  };

  var showFlashPlayer = function (album) {
    $('.flash-player-container').css({zIndex: 0});
    switch(album.mediaType) {
    case ('soundcloud'):
      $("#sc-container").css({zIndex: 10});
      break;
    case ('youtube'):
      $("#yt-container").css({zIndex: 10});
    }
  };

// =================================================

  var setupAlbum = function (album) {
    if (album.id === "all-day") {
      $("#all-day-license-note").show();
    } else {
      $("#all-day-license-note").hide();
    }
    setAlbumTitle(album);
    showFlashPlayer(album);
    MediaPlayer.setupAlbum(album, {
      failureCallback: function () {
        $("#media-error-dialog").dialog("open");
      }
    });
    setDataSourceOptions(album.sampleDataSources);
    setTrackOptions(album.tracks);

    // when setting new data source options, go get the first data source
    setDataSource(album.sampleDataSources[0].id);
  };

  var isManuallySeeking = function () {
    return manualSeek;
  };

  return {
    isManuallySeeking: isManuallySeeking,
    setupAlbum: setupAlbum
  };

}());

