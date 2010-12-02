/*jslint indent:2, browser:true, onevar:false */
/*global $, window, MediaPlayer, AlbumData, Controls, ALL_DAY_ALBUM */

var Manager = (function () {

  var currentAlbum;

  $(document).ready(function () {
    currentAlbum = ALL_DAY_ALBUM;
    Controls.setupAlbum(currentAlbum);
    MediaPlayer.setupAlbum(currentAlbum);
  });

}());