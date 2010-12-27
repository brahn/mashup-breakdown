/*jslint indent:2, browser:true, onevar:false */
/*global $, window, safeLogger */
/*global Album, PlaybackControls, MediaPlayer */

var Editor = (function () {

  var updateEditLink = function () {
    if (!Album.get("editable")) {
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
  Album.onInit.push(updateEditLink);

  var setupEditorDialog = function () {
    $('#editor-dialog').dialog(dialogOptions({
      title: "Samples Editor"
    }));
    $('#edit-samples-link').click(function () {
      $('#editor-dialog').dialog("open");
    });
  };

  $(document).ready(function () {
    setupEditorDialog();
  });

}());

