/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, asPercentage, secToMmss */
/*global YouTube, Visualizer, AlbumData, MediaPlayer */

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

  var setTrackOptions = function (tracks) {
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
    if (sources.length === 1) {
      $("#data-source-text-container").html("Sample info " +
        sources[0].prettyText);
      $("#data-source-select-container").hide();
      $("#data-source-text-container").show();
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

  var setFormat = function (album) {
    if (album.featureVideo) {
      $('#page').addClass('feature-video');
    } else {
      $('#page').removeClass('feature-video');
    }
  };

  var setAlbumTitle = function (album) {
    var titleStr = album.artist + " - " + album.title;
    document.title = titleStr;
    $('#page-title').text(titleStr);
  };

  var setAlbumInfo = function (album) {
    $('#album-links').empty();
    if (!album.links) {
      return;
    }
    $.each(album.links, function (index, linkObj) {
      $('#album-links').append(
        '<a href="' + linkObj.url + '" target="_blank">' + linkObj.title + "</a>"
      );
      if (index < album.links.length - 1) {
        $('#album-links').append("&nbsp;&nbsp;|&nbsp;&nbsp;");
      }
    });
  };

  var setupAlbumLicense = function (album) {
    $('#license-note-container').css("opacity", 0.3);
    $('.license-note').hide();
    $('#' + album.id + "-license-note").show();
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

  var setup = function (album) {
    setFormat(album);
    setAlbumTitle(album);
    setAlbumInfo(album);
    setupAlbumLicense(album);
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

  return {
    setup: setup
  };

}());

