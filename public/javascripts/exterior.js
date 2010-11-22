/*jslint indent:2, browser:true, onevar:false */
/*global $ */

$(document).ready(function () {

  $('#about-dialog-container').dialog(dialogOptions({title: "About"}));

  $('#about-link').click(function () {
    $('#about-dialog-container').dialog("open");
  });

  var addr = "brahn" + "@" + "mashupbreakdown" + "." + "com";
   $('#email-link').html('<a href="mailto:' + addr + '" target="_blank">' + addr + '</a>');

});