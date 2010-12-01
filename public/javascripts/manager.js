/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, AlbumData, Controls, asPercentage */

// Selecting tracks and data sources

var Manager = (function () {

  var currentAlbum, currentTrackIndex, currentData;

  var updateData = function (newData, source, successFunc) {
    currentData = newData;
    $('#data-source-loading-indicator').hide();
    $('#data-source-label-text').show();
    if (source.id === "wikipedia-live") {
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
    var track = currentAlbum.tracks[currentTrackIndex];
    Controls.setupPlayback(track.duration);
    YouTube.setup($("#yt-player-standin"), "ytPlayer", track.ytId,
      playWhenCued, function () {
        $('#yt-error-dialog').dialog("open");
      });
  };

  var updateVisualizer = function () {
    Visualizer.setup(currentData.samples[currentTrackIndex],
      currentAlbum.tracks[currentTrackIndex].duration,
      YouTube.currentTime() || 0);
  };

  var lastAdvanceDateTime = null,
      ADVANCE_HYSTERESIS_IN_SEC = 2;

  // advancing to next track after a track completes
  var advanceTrack = function () {
    if (currentTrackIndex < currentAlbum.tracks.length - 1) {
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

  var setDataSource = function (source, successFunc) {
    $('#data-source-select').val(source.id);
    $('#data-source-reload-link-container').hide();
    $('#data-source-label-text').hide();
    $('#data-source-loading-indicator').show();
    AlbumData.get(source, false, function (results) {
      updateData(results, source, successFunc);
    });
  };


// ================================
// TRACK SELECTOR

  var setTrackOptions = function (tracks) {
    $('#track-select').html($('#track-option-template').
      tmpl({tracks: tracks})).val(0);
  };

  var setupTrackSelect = function (tracks) {
    setTrackOptions(currentAlbum.tracks);
    $('#track-select').change(function () {
      setTrack($(this).val(), YouTube.isPlaying());
      updateVisualizer();
    });
  };

// ================================
// DATA SOURCE SELECTOR

  var findSourceById = function (sourceId) {
    for (var i = 0; i < currentAlbum.sampleDataSources.length; i += 1) {
      if (currentAlbum.sampleDataSources[i].id === sourceId) {
        return currentAlbum.sampleDataSources[i];
      }
    }
    return null;
  };

  var setupDataReloadLink = function () {
    $('#data-source-reload-link').click(function () {
      $('#data-source-reload-link-container').hide();
      $('#data-source-label-text').hide();
      $('#data-source-loading-indicator').show();
      var source = findSourceById($('#data-source-select').val());
      AlbumData.get(source, true,
        function (results) {
          updateData(results, source, updateVisualizer);
        });
    });
  };

  var setDataSourceOptions = function (sources) {
    $('#data-source-select').html($('#data-option-template').tmpl(sources)).
      val(sources[0].id);
  };

  var setupDataSourceSelect = function (sources) {
    setDataSourceOptions(sources);
    $('#data-source-select').change(function () {
      setDataSource(findSourceById($(this).val()), function () {
        updateVisualizer();
      });
    });
    setupDataReloadLink();
  };

  $(document).ready(function () {
    currentAlbum = ALL_DAY_ALBUM;
    setupDataSourceSelect(currentAlbum.sampleDataSources);
    setupTrackSelect(currentAlbum.tracks);
    setDataSource(currentAlbum.sampleDataSources[0], function () {
      setTrack(0);
      updateVisualizer();
    });
  });

}());