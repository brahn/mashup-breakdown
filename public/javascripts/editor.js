/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, timeStrToSec, secToMmss, roundTo */
/*global Album, PlaybackControls, MediaPlayer, Visualizer */

var Editor = (function () {

// ===================================
// COMMON ELEMENTS

  var $inputStart = null,
      $inputEnd = null,
      $inputArtist = null,
      $inputTitle = null,
      $selectFromList = null;

  $(document).ready(function () {
    $inputStart = $('#editor input#start');
    $inputEnd = $('#editor input#end');
    $inputArtist = $('#editor input#artist');
    $inputTitle = $('#editor input#title');
    $selectFromList = $('#editor select#sample-list');
  });

// ===================================
// SHOWING/HIDING EDITOR

  var m_isEditing = null;
  var m_firstEdit = true;

  var setDisplayMode = function (mode) {
    switch (mode) {
    case "landing":
      deselectSample();
      $('#editor #sample-info-container').hide();
      $('#editor #landing-text').show();
      $('#editor #delete-sample-button').attr('disabled', 'disabled');
      $('#editor #new-sample-button').attr('disabled', '');
      break;
    case "sample-selected":
      $('#editor #landing-text').hide();
      $('#editor #delete-sample-button').attr('disabled', '');
      $('#editor #new-sample-button').attr('disabled', '');
      $('#editor #sample-info-container input').attr('disabled', '');
      $('#editor #sample-info-container select').attr('disabled', '');
      $('#editor #delete-sample-button').attr('disabled', '');
      $('#editor #sample-info-container').show();
      break;
    case "no-sample-selected":
      $('#editor #landing-text').hide();
      $('#editor #delete-sample-button').attr('disabled', 'disabled');
      $('#editor #new-sample-button').attr('disabled', '');
      $('#editor #sample-info-container input').attr('disabled', 'disabled');
      $('#editor #sample-info-container select').attr('disabled', 'disabled');
      $('#editor #delete-sample-button').attr('disabled', 'disabled');
      $('#editor #sample-info-container').show();
      break;
    }
  };

  var showEditor = function () {
    m_isEditing = true;
    if (m_firstEdit) {
      setDisplayMode("landing");
      m_firstEdit = false;
    } else {
      setDisplayMode("no-sample-selected");
    }
    $("#page").addClass('show-editor');
    $(window).triggerHandler('resize');
  };

  var hideEditor = function () {
    m_isEditing = false;
    $("#page").removeClass('show-editor');
    $(window).triggerHandler('resize');
    deselectSample();
  };

  var setupEditShowHide = function (forceReveal) {
    $('#edit-samples-link').click(showEditor);
    $('#editor-container div.close-button').click(hideEditor);
    if (!Album.get("editable") && !forceReveal) {
      $('#edit-samples-link-container').hide();
      return;
    }
    // this part just makes it prettier
    var sources = Album.get("sampleDataSources");
    if (sources.length === 1 && sources[0].prettyText) {
      $('#edit-samples-link-separator').show();
    } else {
      $('#edit-samples-link-separator').hide();
    }
    $('#edit-samples-link-container').show();
  };
  Album.onInit.push(setupEditShowHide);

// =========================================
// CURRENT PLAYPOINT INFORMATION

  var updatePlaypoint = function () {
    $('#editor #current-time').html(secToMmss(MediaPlayer.getTime() || 0, 3));
  };
  MediaPlayer.onTimeChanged.push(updatePlaypoint);

// ========================================
// TRACK WHAT WE'RE EDITING

  var m_selectedSample = null;
  var m_selectedBlock = null;
  var m_updateOnInputChange = true;

// =========================================
// VISUAL EFFECTS

  var highlightSelectedBlock = function () {
    if (!m_selectedBlock) {
      return;
    }
    Visualizer.activateBlock(m_selectedBlock);
    // XXX Make this activation survive change in visualizer time.
    m_selectedBlock.css({
      "outline-style": "dotted",
      "outline-color": "#FFF",
      "outline-width": "3px"
    });
  };

  var removeHighlightFromSelectedBlock = function () {
    if (!m_selectedBlock) {
      return;
    }
    m_selectedBlock.css({
      "outline-style": "none"
    });
    var visualizerTime = Visualizer.getTime() || -1;
    if (visualizerTime < m_selectedSample.start ||
      visualizerTime > m_selectedSample.end) {
      Visualizer.deactivateBlock(m_selectedBlock);
    }
  };

// =====================================
// PULLING FROM SPECIFIC LIST OF SAMPLES

  var m_sampleList = null;

  var sampledTrackSort = function (a, b) {
    if (a.artist > b.artist || !a.artist && b.artist) {
      return 1;
    }
    if (a.artist < b.artist || a.artist && !b.artist) {
      return -1;
    }
    if (a.title > b.title || !a.title && b.title) {
      return 1;
    }
    if (a.title < b.title || a.title && !b.title) {
       return -1;
    }
    return 0;
  };

  var setupListOrFreeInput = function () {
    m_sampleList = Album.get("sampleList").sort(sampledTrackSort);
    if (!m_sampleList || m_sampleList.length === 0) {
      m_sampleList = null;
      $('#editor div#sample-list-container').hide();
      $('#artist-input-container, #title-input-container').show();
    } else {
      $.each(m_sampleList, function (index, sample) {
        $selectFromList.append(
          '<option value="' + index + '">' +
          sample.artist + ' - "' + sample.title + '"' +
          '</option>');
        });
      $('#artist-input-container, #title-input-container').hide();
      $('#editor div#sample-list-container').show();
    }
  };
  Album.onInit.push(setupListOrFreeInput);

  var assignSampledTrackIds = function () {
    if (!m_sampleList) {
      return;
    }
    $.each(Album.getCurrentTrack("samples"), function (index, sample) {
      for (var i = 0; i < m_sampleList.length; i += 1) {
        if (m_sampleList[i].artist === sample.artist &&
          m_sampleList[i].title === sample.title) {
          sample.sampledTrackId = i;
          return;
        }
      }
      sample.sampledTrackId = -1;
    });
  };
  Album.onDataChanged.push(assignSampledTrackIds);

// =========================================
// SELECTING SAMPLES FOR EDITING

  var deselectSample = function (toSelectAnother) {
    if (!toSelectAnother) {
      setDisplayMode('no-sample-selected');
    }
    if (!m_selectedSample) {
      return;
    }
    removeHighlightFromSelectedBlock();
    m_selectedSample = null;
    m_selectedBlock = null;
    $inputStart.val("");
    $inputEnd.val("");
    if (m_sampleList) {
      $selectFromList.val("-1");
    } else {
      $inputArtist.val("");
      $inputTitle.val("");
    }
  };

  var selectSample = function (sample) {
    deselectSample(true);
    m_selectedSample = sample;
    m_selectedBlock = sample.block;
    highlightSelectedBlock();
    m_updateOnInputChange = false;
    $inputStart.val(secToMmss(sample.start, 3));
    $inputEnd.val(secToMmss(sample.end, 3));
    if (m_sampleList) {
      $selectFromList.val(sample.sampledTrackId);
    } else {
      $inputArtist.val(sample.artist);
      $inputTitle.val(sample.title);
    }
    m_updateOnInputChange = true;
    setDisplayMode('sample-selected');
  };

  var maybeSelectBlock = function (block) {
    if (m_isEditing) {
      selectSample($(block).data("sample"));
    }
  };

  $(document).ready(function () {
    // selection
    $('.sample-block').live("click", function () {
      maybeSelectBlock(this);
    });
    // deselection
    $(document).click(function (event) {
      if (!isOrAncestorIs(event.target,
        '#editor, .player, .flash-player-container, .sample-block, .tipsy')) {
        deselectSample();
      }
    });
  });

// =========================================
// EDITING A SELECTED SAMPLE

  var updateSampleFromInputs = function () {
    m_selectedSample.start = roundTo(timeStrToSec($inputStart.val()), 3);
    m_selectedSample.end = roundTo(timeStrToSec($inputEnd.val()), 3);
    if (m_sampleList) {
      var sampleIndex = parseInt($selectFromList.val(), 10);
      m_selectedSample.sampledTrackId = sampleIndex;
      if (sampleIndex >= 0) {
        m_selectedSample.artist = m_sampleList[sampleIndex].artist;
        m_selectedSample.title = m_sampleList[sampleIndex].title;
      } else {
        m_selectedSample.artist = "";
        m_selectedSample.title = "";
      }
    } else {
      m_selectedSample.artist = $inputArtist.val();
      m_selectedSample.title = $inputTitle.val();
    }
    m_selectedBlock = null;
    Visualizer.refresh(Visualizer.getTime());
    m_selectedBlock = m_selectedSample.block;
    highlightSelectedBlock();
  };

  var validateInputs = function () {
    var isValid = true;
    if (timeStrToSec($inputStart.val()) === null) {
      $inputStart.addClass('invalid');
      isValid = false;
    } else {
      $inputStart.removeClass('invalid');
    }
    if (timeStrToSec($inputEnd.val()) === null) {
      $inputEnd.addClass('invalid');
      isValid = false;
    } else {
      $inputEnd.removeClass('invalid');
    }
    return isValid;
  };

  var maybeUpdateSampleFromInputs = function () {
    if (m_selectedSample && m_updateOnInputChange && validateInputs()) {
      updateSampleFromInputs();
    }
  };

  $(document).ready(function () {
    watchForChanges($('#sample-info-container input'), function () {
      maybeUpdateSampleFromInputs();
    });
    $('select#sample-list').change(maybeUpdateSampleFromInputs);
    $('#sample-info-container input, #sample-info-container select, ' +
      'input#sample_set_name').
      focus(PlaybackControls.disableSpaceTogglesPlay).
      blur(PlaybackControls.enableSpaceTogglesPlay);
  });

// ======================================
// CREATING AND DESTROYING SAMPLES

  var createSample = function () {
    var newSample = {
      start: Visualizer.getTime() || 0,
      end: Math.min(Visualizer.getTime() + 5,
        Album.getCurrentTrack("duration")),
      artist: "",
      title: ""
    };
    if (m_sampleList) {
      newSample.sampledTrackId = -1;
    }
    Album.getCurrentTrack("samples").push(newSample);
    m_selectedBlock = null;
    Visualizer.refresh(Visualizer.getTime());
    selectSample(newSample);
  };

  var deleteSelectedSample = function () {
    var samples = Album.getCurrentTrack("samples");
    for (var i = 0; i < samples.length ; i += 1) {
      if (samples[i] === m_selectedSample) {
        samples.splice(i, 1);
        return;
      }
    }
  };

  var maybeDeleteSelectedSample = function () {
    if (!m_selectedSample) {
      return;
    }
    var c = confirm("Delete the selected sample?");
    if (!c) {
      return;
    }
    deleteSelectedSample();
    m_selectedBlock = null;
    Visualizer.refresh(Visualizer.getTime());
    setDisplayMode("no-sample-selected");
  };

  $(document).ready(function () {
    $("#editor #new-sample-button").click(createSample);
    $("#editor #delete-sample-button").click(maybeDeleteSelectedSample);
  });

// =====================================
// SETTING START/END TO CURRENT PLAYPOINT

  $(document).ready(function () {
    $('#editor #start-at-current').click(function () {
      $('#editor input#start').val($('#editor #current-time').text());
      maybeUpdateSampleFromInputs();
    });
    $('#editor #end-at-current').click(function () {
      $('#editor input#end').val($('#editor #current-time').text());
      maybeUpdateSampleFromInputs();
    });
  });

// ======================================
// SAVING 
// XXX shouldn't really be here

  var sampleEssentials = function (albumSamples) {
    var albumEssentials = [];
    $.each(albumSamples, function (index, trackSamples) {
      var trackEssentials = [];
      albumEssentials.push(trackEssentials);
      $.each(trackSamples, function (index2, sample) {
        trackEssentials.push({
          start: sample.start,
          end: sample.end,
          artist: sample.artist,
          title: sample.title
        });
      });
    });
    return albumEssentials;
  };

  var saveSampleData = function () {
    var sampleSetName = $('input#sample_set_name').val().trim().toLowerCase();
    $('input#sample_set_name').val(sampleSetName);
    if (!sampleSetName) {
      alert("Please enter a sample set name to save");
      return;
    }
    var data = {
      tracks: Album.get("tracks"),
      samples: sampleEssentials(Album.get("samples"))
    };
    $.post("/samplestash/write_json",
      { album_short_name: Album.get("id"),
        stash_name: sampleSetName,
        sample_data: JSON.stringify(data),
        authenticity_token: AUTH_TOKEN
      });
  };

  var loadSampleData = function () {
    var sampleSetName = $('input#sample_set_name').val().trim().toLowerCase();
    $('input#sample_set_name').val(sampleSetName);
    var source = {
      id: Album.get("id") + "_" + sampleSetName,
      type: "json",
      url: "/samplestash/read_json" +
        "?album_short_name=" + encodeURIComponent(Album.get("id")) +
        "&stash_name=" + encodeURIComponent(sampleSetName),
      prettyText: "live edit"
    };
    Album.setDataSource(source, true);
  };

  $(document).ready(function () {
    $("#save-button").click(saveSampleData);
    $("#load-button").click(loadSampleData);
  });


// ======================================

  return {
    show: showEditor,
    hide: hideEditor,
    setDisplayMode: setDisplayMode
  };

}());

/*
// XXX TESTING ONLY
Album.onInit.push(function () {
  Editor.show();
  Editor.setDisplayMode();
});
*/

