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

var albumLinkHtml = function (seed) {
  return "<a href='/" + seed.id + "'>" + artistAndTitleString(seed) +
    "</a>";
};

var sortSeeds = function (seedA, seedB) {
  var strA = artistAndTitleString(seedA).toLowerCase(),
      strB = artistAndTitleString(seedB).toLowerCase();
  if (strA > strB) {
    return 1;
  } else if (strA < strB) {
    return -1;
  }
  return 0;
};

var setupAlbumDialogLinks = function () {
  var listElt = $("#artists-and-albums-dialog ul");
  $.each(ALBUM_SEEDS.sort(sortSeeds), function (index, seed) {
    if (!seed.draftMode) {
      listElt.append("<li>" + albumLinkHtml(seed) + "</li>");
    }
  });
};

var setupAlbumDialog = function () {
  $('#artists-and-albums-dialog').dialog(dialogOptions({
    title: "Choose an Album"
  }));
  $('#artists-and-albums-link').click(function () {
    $('#artists-and-albums-dialog').dialog("open");
  });
  setupAlbumDialogLinks();
};

$(document).ready(function () {

  setupAlbumDialog();

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