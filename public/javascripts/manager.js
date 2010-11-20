/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, Data, Controls, asPercentage */

// Selecting tracks and data sources

var Manager = (function () {

  // INITIAL_SOURCE can be "allDaySamples" or "wikipedia"
  var INITIAL_SOURCE = "wikipedia";

  var currentAlbum, currentTrackIndex;

  var setDataSource = function (source, successFunc) {
    $('#data-source-select').val(source);
    Data.getAlbum(source, function (returnedAlbum) {
      currentAlbum = returnedAlbum;
      successFunc();
    });
  };

  var setTrack = function (trackIndex, playWhenCued) {
    currentTrackIndex = parseInt(trackIndex);
    $('#track-select').val(currentTrackIndex);
    var track = Data.tracks()[currentTrackIndex];
    Controls.setup(track.duration);
    YouTube.setup($("#yt-player-standin"), "ytPlayer", track.ytId,
      playWhenCued);
  };

  var updateVisualizer = function () {
    Visualizer.setup(currentAlbum[currentTrackIndex].samples,
      Data.tracks()[currentTrackIndex].duration);
    Visualizer.setTime(Controls.getTime());
  };

  // advancing to next track after a track completes
  var advanceTrack = function () {
    if (currentTrackIndex < currentAlbum.length) {
      setTrack(currentTrackIndex + 1, true);
      updateVisualizer();
    }
  };
  YouTube.onStateChange.push(function (state) {
    if (state === 0) {
      advanceTrack();
    }
  });

  // track selection drop-down
  var setupTrackSelect = function () {
    $.each(Data.tracks(), function (index, track) {
      $('#track-select').append("<option value='" + index + "'>" +
        (index + 1) + ". " + track.title + "</option>");
    });
    $('#track-select').change(function () {
      setTrack($(this).val(), YouTube.isPlaying());
      updateVisualizer();
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

  $(document).ready(function () {
    setupTrackSelect();
    setupDataSourceSelect();
    setDataSource(INITIAL_SOURCE, function () {
      setTrack(0);
      updateVisualizer();
    });
  });

}());