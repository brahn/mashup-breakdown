/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, asPercentage */

// Selecting tracks and data sources 

var Manager = (function () {
  // source can be "allDaySamples" or "wikipedia"
  var source = "allDaySamples",
      album,
      currentTrackIndex;

  var setupTrack = function (trackIndex, playWhenCued) {
    currentTrackIndex = parseInt(trackIndex);
    $('#track-select').val(currentTrackIndex);
    var track = album[currentTrackIndex];
    Controls.setup(track.duration);
    Visualizer.setup(track);
    if (YouTube.isCreated()) {
      if (playWhenCued) {
        YouTube.load(track.ytId);
      } else {
        YouTube.cue(track.ytId);
      }
    } else {
      YouTube.setup($("#yt-player-standin"), "ytPlayer", track.ytId,
        playWhenCued);
    }
  };

  var setupTrackSelect = function (album) {
    $.each(album, function (index, track) {
      $('#track-select').append("<option value='" + index + "'>" +
        (index + 1) + ". " + track.title + "</option>");
    });
    $('#track-select').change(function () {
      setupTrack($(this).val(), YouTube.isPlaying());
    });
  };

  var advanceTrack = function () {
    if (currentTrackIndex < album.length) {
      setupTrack(currentTrackIndex + 1, true);
    }
  };
  YouTube.onStateChange.push(function (state) {
    if (state === 0) {
      advanceTrack();
    }
  });

  var setupAlbum = function (specifiedAlbum) {
    album = specifiedAlbum;
    setupTrackSelect(album);
  };

  $(document).ready(function () {
    if (source === "allDaySamples") {
      setupAlbum(albumFromAllDaySamples);
      setupTrack(0);
    } else {
      $.get("/javascripts/data/wikipedia.txt", function (results) {
        var albumFromWikipedia = parseWikipediaText(results);
        addEndTimesToSamples(albumFromWikipedia);
        setupAlbum(albumFromWikipedia);
        setupTrack(0);
      });
    }
  });

}());