/*jslint indent:2, browser:true, onevar:false */
/*global $ */

$(document).ready(function () {

  $('#about-dialog-container').dialog({
    autoOpen: false,
    width: function () {
             return Math.min($('#samples').width(), 500);
           },
    height: $('#samples').height(),
    title: "About",
    modal: true,
    draggable: false,
    resizable: false,
    zIndex: 1000000 // need to cover tooltips
  });

  $('#about-link').click(function () {
    $('#about-dialog-container').dialog("open");
  });

});