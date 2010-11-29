/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, SampleData, Controls, asPercentage */

// Selecting tracks and data sources

var Manager = (function () {

  // INITIAL_SOURCE can be "allDaySamples", "wikipedia", or "live-wikipedia"
  var INITIAL_SOURCE = "wikipedia";

  var currentAlbum, currentTrackIndex;

  var updateData = function (returnedAlbum, source, successFunc) {
    currentAlbum = returnedAlbum;
    $('#data-source-loading-indicator').hide();
    $('#data-source-label-text').show();
    if (source === "live-wikipedia") {
      $('#data-source-reload-link-container').show();
    } else {
      $('#data-source-reload-link-container').hide();
    }
    if (successFunc) {
      successFunc();
    }
  };

  var setTrack = function (trackIndex, playWhenCued) {
    currentTrackIndex = parseInt(trackIndex);
    $('#track-select').val(currentTrackIndex);
    var track = SampleData.tracks()[currentTrackIndex];
    Controls.setup(track.duration);
    YouTube.setup($("#yt-player-standin"), "ytPlayer", track.ytId,
      playWhenCued, function () {
        $('#yt-error-dialog').dialog("open");
      });
  };

  var updateVisualizer = function () {
    Visualizer.setup(currentAlbum[currentTrackIndex].samples,
      SampleData.tracks()[currentTrackIndex].duration);
    Visualizer.setTime(Controls.getTime());
  };

  var lastAdvanceDateTime = null,
      ADVANCE_HYSTERESIS_IN_SEC = 2;

  // advancing to next track after a track completes
  var advanceTrack = function () {
    if (currentTrackIndex < currentAlbum.length - 1) {
      setTrack(currentTrackIndex + 1, true);
      updateVisualizer();
    }
  };
  YouTube.onStateChange.push(function (state) {
    if (state === 0) {
      var tempDateTime = new Date();
      if (!lastAdvanceDateTime || (tempDateTime - lastAdvanceDateTime) >
           ADVANCE_HYSTERESIS_IN_SEC * 1000 )
      lastAdvanceDateTime = tempDateTime;
      safeLogger(lastAdvanceDateTime);
      advanceTrack();
    }
  });

  // track selection drop-down
  var setupTrackSelect = function () {
    $.each(SampleData.tracks(), function (index, track) {
      $('#track-select').append("<option value='" + index + "'>" +
        "Track " + (index + 1) + " - " + track.title + "</option>");
    });
    $('#track-select').change(function () {
      setTrack($(this).val(), YouTube.isPlaying());
      updateVisualizer();
    });
  };

  var setDataSource = function (source, successFunc) {
    $('#data-source-select').val(source);
    $('#data-source-reload-link-container').hide();
    $('#data-source-label-text').hide();
    $('#data-source-loading-indicator').show();
    SampleData.getAlbum(source, false, function (returnedAlbum) {
      updateData(returnedAlbum, source, successFunc);
    });
  };

  // data source selection drop-down
  var setupDataSourceSelect = function () {
    $('#data-source-select').change(function () {
      setDataSource($(this).val(), function () {
        updateVisualizer();
      });
    });
  };

  var setupDataReloadLink = function () {
    $('#data-source-reload-link').click(function () {
      var source = $('#data-source-select').val();
      $('#data-source-reload-link-container').hide();
      $('#data-source-label-text').hide();
      $('#data-source-loading-indicator').show();
      SampleData.getAlbum(source, true, function (returnedAlbum) {
        updateData(returnedAlbum, source, updateVisualizer);
      });
    });
  };

  $(document).ready(function () {
    setupTrackSelect();
    setupDataSourceSelect();
    setupDataReloadLink();
    setDataSource(INITIAL_SOURCE, function () {
      setTrack(0);
      updateVisualizer();
    });
  });

}());