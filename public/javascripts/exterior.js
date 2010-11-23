/*jslint indent:2, browser:true, onevar:false */
/*global $ */

$(document).ready(function () {

  $('#about-dialog-container').dialog(dialogOptions({title: "About"}));

  var areCommentsSetup = false;
  $('#comments-dialog').dialog(dialogOptions({
    title: "Feedback",
    open: function () {
      if (!areCommentsSetup) {
        $('#dialog-container').append($('#disqus-container'));
      }
    }
  }));

  $('#comments-link').click(function () {
    $('#comments-dialog').dialog("open");
  });

  $('#about-link').click(function () {
    $('#about-dialog-container').dialog("open");
  });

  var addr = "brahn" + "@" + "mashupbreakdown" + "." + "com";
   $('#email-link').html('<a href="mailto:' + addr + '" target="_blank">' + addr + '</a>');

});