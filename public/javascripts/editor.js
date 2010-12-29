/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger */
/*global Album, PlaybackControls, MediaPlayer */

var Editor = (function () {

// ===================================
// SHOWING/HIDING EDITOR

  var setDisplayMode = function (mode) {
    switch (mode) {
    case "landing":
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
    setDisplayMode("landing");
    $("#page").addClass('show-editor');
    $(window).triggerHandler('resize');
  };

  var hideEditor = function () {
    $("#page").removeClass('show-editor');
    $(window).triggerHandler('resize');
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
    if (sources.length == 1 && sources[0].prettyText) {
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
    $('#editor #current-time').html(secToMmss(MediaPlayer.getTime() || 0, 2));
  };
  MediaPlayer.onTimeChanged.push(updatePlaypoint);

// ========================================
// 

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

