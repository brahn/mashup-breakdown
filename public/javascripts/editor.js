/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger, timeStrToSec, secToMmss, roundTo */
/*global Album, PlaybackControls, MediaPlayer, Visualizer */

var Editor = (function () {

// ===================================
// COMMON ELEMENTS

  var $inputStart = null,
      $inputEnd = null,
      $inputArtist = null,
      $inputTitle = null;

  $(document).ready(function () {
    $inputStart = $('#editor input#start');
    $inputEnd = $('#editor input#end');
    $inputArtist = $('#editor input#artist');
    $inputTitle = $('#editor input#title');
  });

// ===================================
// SHOWING/HIDING EDITOR

  var m_isEditing = null;

  var setDisplayMode = function (mode) {
    switch (mode) {
    case "landing":
      deselectSample();
      $('#editor #sample-info-container').hide();
      $('#editor #landing-text').show(); 
      $('#editor #delete-sample-button').hide();
      $('#editor #new-sample-button').show();
      $('#editor #sample-controls').show();
      break;
    default:
      $('#editor #landing-text').hide();
      $('#editor #sample-info-container').show();
      $('#editor #delete-sample-button').show();
      $('#editor #new-sample-button').show();
      $('#editor #sample-controls').show();
    }
  };

  var showEditor = function () {
    m_isEditing = true;
    setDisplayMode("landing");
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
    var visualizerTime = Visualizer.getTime();
    if (visualizerTime < m_selectedSample.start ||
      visualizerTime > m_selectedSample.end) {
      Visualizer.deactivateBlock(m_selectedBlock);
    }
  };

// =========================================
// SELECTING SAMPLES FOR EDITING

  var deselectSample = function () {
    removeHighlightFromSelectedBlock();
    m_selectedSample = null;
    m_selectedBlock = null;
    $inputStart.val("");
    $inputEnd.val("");
    $inputArtist.val("");
    $inputTitle.val("");
  };

  var selectSample = function (sample) {
    setDisplayMode();
    deselectSample();
    m_selectedSample = sample;
    m_selectedBlock = sample.block;
    highlightSelectedBlock();
    m_updateOnInputChange = false;
    $inputStart.val(secToMmss(sample.start, 3));
    $inputEnd.val(secToMmss(sample.end, 3));
    $inputArtist.val(sample.artist);
    $inputTitle.val(sample.title);
    m_updateOnInputChange = true;
  };

  var maybeSelectBlock = function (block) {
    if (m_isEditing) {
      selectSample($(block).data("sample"));
    }
  };

  $(document).ready(function () {
    $('.sample-block').live("click", function () {
      maybeSelectBlock(this);
    });
    // XXX need to make this also work when tipsy is clicked
  });

// =========================================
// EDITING A SELECTED SAMPLE

  var updateSampleFromInputs = function () {
    m_selectedSample.start = roundTo(timeStrToSec($inputStart.val()), 3);
    m_selectedSample.end = roundTo(timeStrToSec($inputEnd.val()), 3);
    m_selectedSample.artist = $inputArtist.val();
    m_selectedSample.title = $inputTitle.val();
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
    watchForChanges($('#sample-info-container input'),
      maybeUpdateSampleFromInputs);
    $('#sample-info-container input').
      focus(PlaybackControls.disableSpaceTogglesPlay).
      blur(PlaybackControls.enableSpaceTogglesPlay);
  });

// ======================================

  return {
    show: showEditor,
    hide: hideEditor,
    setDisplayMode: setDisplayMode
  };

}());


// XXX TESTING ONLY
Album.onInit.push(function () {
  Editor.show();
  Editor.setDisplayMode();
});

