/*jslint indent:2, browser:true, onevar:false */
/*global $ */

$(document).ready(function () {

  $('#about-dialog-container').dialog(dialogOptions({title: "About"}));

/*
  setInterval(function () {
    $('#comments-dialog').dialog(dialogOptions({
      title: "Feedback",
      width: 700
    }));
  }, 0);

  $('#comments-link').click(function () {
    $('#comments-dialog').dialog("open");
  });
*/

  $('#about-link').click(function () {
    $('#about-dialog-container').dialog("open");
  });

  var addr = "brahn" + "@" + "mashupbreakdown" + "." + "com";
   $('#email-link').html('<a href="mailto:' + addr + '" target="_blank">' + addr + '</a>');

});