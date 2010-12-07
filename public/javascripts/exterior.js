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

var gotoAlbum = function (albumId) {
  Controls.setupAlbum(getAlbumById(albumId));
  $('#artists-and-albums-dialog').dialog("close");
};


$(document).ready(function () {

  $('#artists-and-albums-dialog').dialog(dialogOptions({
    title: "Choose an Album"
  }));
  $('#artists-and-albums-link').click(function () {
    $('#artists-and-albums-dialog').dialog("open");
  });

  $("#media-error-dialog").dialog(dialogOptions({
    title: "Dang!",
    height: 250
  }));

  $("#no-album-dialog").dialog(dialogOptions({
    title: "Dang!",
    height: 250
  }));

  dimHeader(true);
  $("#application-header").mouseenter(function () {highlightHeader();}).
    mouseleave(function () {dimHeader();});

});