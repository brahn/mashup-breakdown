/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger */
/*global Album, PlaybackControls, MediaPlayer */

var Editor = (function () {

  var showEditor = function () {
    $("#page").addClass('show-editor');
    $(window).triggerHandler('resize');
  };

  var hideEditor = function () {
    $("#page").removeClass('show-editor');
    $(window).triggerHandler('resize');
  };

  var setupEditShowHide = function (forceReveal) {
    $('#edit-samples-link').click(showEditor);
    $('#editor div.close-button').click(hideEditor);
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

  // XXX TESTING ONLY
  Album.onInit.push(showEditor);

}());


