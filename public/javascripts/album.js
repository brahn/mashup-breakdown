/*jslint indent:2, browser:true, onevar:false regexp:false */
/*global $, window, sendEvent, safeLogger, eachKey */
/*global DataRetriever */

var Album = (function () {

  var m_album = null;

// ===================================
// ACCESS TO ALBUM INFORMATION

  // Returns the curent album object, or just a requested field
  var get = function (key) {
    if (key) {
      return m_album && m_album[key];
    } else {
      return m_album;
    }
  };

  // Returns 
  // * currently playing track object (if key is null)
  // * samples for currently playing track (if key == "samples")
  // * key field of currently playing track (otherwise)
  var getCurrentTrack = function (key) {
    var currentTrackIndex = MediaPlayer.getTrackIndex();
    if (currentTrackIndex === null || currentTrackIndex === undefined) {
      return undefined;
    }
    if (key == "samples") {
      return m_album.samples && m_album.samples[currentTrackIndex];
    } else {
      var currentTrack = m_album.tracks && m_album.tracks[currentTrackIndex];
      if (key) {
        return currentTrack && currentTrack[key];
      } else {
        return currentTrack;
      }
    }
  };


// ===================================
// CHANGING DATA SOURCES

  // Callbacks to data change, which would result from setSource
  var onDataChanged = [];

  var setDataSource = function (source, forceReload) {
    DataRetriever.getFromSource(source, forceReload, function (results) {
      m_album.samples = results.samples;
      $.extend(true, m_album.tracks, results.tracks);
      m_album.currentSource = source;
      sendEvent(onDataChanged);
    });
  };

  // Returns current data _source_ object
  var getDataSource = function () {
    return get("currentSource");
  };

// ==================================
// INITIALIZATION

  // Callbacks to album change, which would result from init
  var onInit = [];

  // Specify the album with sufficient data to kick things off.
  var init = function (albumSeed) {
    m_album = {};
    $.extend(true, m_album, albumSeed);
    DataRetriever.clearCache();
    if (m_album.sampleDataSources) {
      setDataSource(m_album.sampleDataSources[0]); // Note: this is async.
    }
    sendEvent(onInit);
  };


// ================================

  return {
    onInit: onInit,
    init: init,
    get: get,
    getCurrentTrack: getCurrentTrack,

    onDataChanged: onDataChanged,
    setDataSource: setDataSource,
    getDataSource: getDataSource
  };

}());