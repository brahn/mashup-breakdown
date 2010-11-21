/*jslint indent:2, browser:true, onevar:false */
/*global $ */

$(document).ready(function () {

  $('#about-dialog-container').dialog({
//    autoOpen: false,
    width: $('#samples').width(),
    height: $('#samples').height(),
    modal: true
  });

  $('#about-link').click(function () {
    $('#about-dialog-container').dialog("open");
  });

});