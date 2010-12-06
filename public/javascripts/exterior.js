/*jslint indent:2, browser:true, onevar:false */
/*global $ */


var highlightHeader = function () {
  $("#application-header").stop().animate({opacity: 1.0}, 100);
};

var dimHeader = function (suppressAnimation) {
  if (suppressAnimation) {
    $("#application-header").stop().css({opacity: 0.5});
  } else {
    $("#application-header").stop().animate({opacity: 0.5}, 100);
  }
};


$(document).ready(function () {

  $('#about-dialog-container').dialog(dialogOptions({title: "About"}));

  $("#media-error-dialog").dialog(dialogOptions({
    title: "Dang!",
    height: 250
  }));

  dimHeader(true);
  $("#application-header").mouseenter(function () {highlightHeader();}).
    mouseleave(function () {dimHeader();});

});