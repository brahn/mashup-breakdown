/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, asPercentage, secToMmss */
/*global YouTube, Visualizer, Album, MediaPlayer */

var AlbumControls = (function () {

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

  var setTrackOptions = function () {
    var tracks = Album.get("tracks");
    if (!tracks || tracks.length < 2) {
      $('#track-select').hide();
      return;
    }
    $('#track-select').empty().show();
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

  // update only track titles, rather than entire selector,
  // so as not to disrupt currently set value
  var refreshTrackOptionText = function () {
    $.each(Album.get("tracks"), function (index, track) {
      $('#track-select').find('option[value=' + index + ']').
        html(trackOptionText(track.title, index));
    });
  };
  Album.onDataChanged.push(refreshTrackOptionText);

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
    Album.setDataSource(findSourceById(sourceId), forceReload);
  };
  // callback to change in data source, which results from setDataSource
  Album.onDataChanged.push(function () {
    var sourceId = Album.getDataSource().id;
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

  var setDataSourceOptions = function () {
    var sources = Album.get("sampleDataSources");
    m_sampleDataSources = sources;
    if (sources.length === 1) {
      if (sources[0].prettyText) {
        $("#data-source-text-container").html("Sample info " +
          sources[0].prettyText);
        $("#data-source-select-container").hide();
        $("#data-source-text-container").show();
      }
      return;
    }
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
    $("#data-source-text-container").hide();
    $("#data-source-select-container").show();
  };

// ================================================
// MISC

  var setAlbumTitle = function () {
    var titleStr = Album.get("artist") + " - " + Album.get("title");
    document.title = titleStr;
    $('#page-title').text(titleStr);
  };

  var setAlbumInfo = function () {
    var links = Album.get("links");
    $('#album-links').empty();
    if (!links) {
      return;
    }
    $.each(links, function (index, linkObj) {
      $('#album-links').append(
        '<a href="' + linkObj.url + '" target="_blank">' + linkObj.title + "</a>"
      );
      if (index < links.length - 1) {
        $('#album-links').append("&nbsp;&nbsp;|&nbsp;&nbsp;");
      }
    });
  };

  var setupAlbumLicense = function () {
    $('#license-note-container').css("opacity", 0.3);
    $('.license-note').hide();
    $('#' + Album.get("id") + "-license-note").show();
  };

  var showFlashPlayer = function () {
    $('.flash-player-container').css({zIndex: 0});
    switch (Album.get("mediaType")) {
    case ('soundcloud'):
      $("#sc-container").css({zIndex: 10});
      break;
    case ('audio'):
      $("#audio-container").css({zIndex: 10});
      break;
    case ('youtube'):
      $("#yt-container").css({zIndex: 10});
    }
  };

// =================================================

  var setup = function () {
    setAlbumTitle();
    setAlbumInfo();
    setupAlbumLicense();
    showFlashPlayer();
    setDataSourceOptions();
    setTrackOptions();
  };
  Album.onInit.push(setup);

}());

