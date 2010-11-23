/*jslint indent:2, browser:true, onevar:false */
/*global $ */

$(document).ready(function () {

  $('#about-dialog-container').dialog(dialogOptions({title: "About"}));

  $(document).ready(function () {
    $("#yt-error-dialog").dialog(dialogOptions({
      title: "Dang!",
      height: 250
    }));
  });

  $('#comments-link').click(function () {
    $('#comments-dialog').dialog("open");
  });

  $('#about-link').click(function () {
    $('#about-dialog-container').dialog("open");
  });

  var addr = "brahn" + "@" + "mashupbreakdown" + "." + "com";
   $('#email-link').html('<a href="mailto:' + addr + '" target="_blank">' + addr + '</a>');

});