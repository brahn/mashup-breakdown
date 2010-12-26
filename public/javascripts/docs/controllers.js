// =====================
// DataRetriever
//
// Object is Responsible for getting album data from specified source
// (e.g. text file, wikipedia).  By default, caches data.

  // successFunc takes an object "results" with two fields:
  // * tracks
  // * samples
  var getFromSource = function (source, forceReload, successFunc) {};

  // Clear all stored data
  var clearCache = function () {};

// =====================
// Album

  // Callbacks to album change, which would result from init
  var onInit = [];

  // Specify the album with sufficient data to kick things off.
  var init = function (albumSeed) {};

  // Returns the album object, or if key is passed, just the
  // requested field
  var get = function (key) {};

  // Callbacks to data change, which would result from setSource
  var onDataChanged = [];

  // Set the data source object on which album data is based.
  // By default, data will be pulled from cache if it is available.
  // To ignore cached version and reload data, set forceReload to true.
  var setDataSource = function (source, forceReload) {};

  // Returns current data _source_ object
  var getDataSource = function () {};

// ======================
// MediaPlayer

  // Initialize player with specified album.
  // options can carry the following optional fields (defaults in parens)
  // * playWhenCued (default)
  // * failureCallback (null function)
  // * startAtTrack (0)
  // * startAtTime (0) XXX not yet implemented

  var setupAlbum = function (album, options) {};
  var gotoTrack = function (trackIndex, playImmediately) {};

  var play = function () {};
  var pause = function () {};
  // keys for option object
  // * allowSeekAhead (youtube-specific)
  var seekTo = function (time, options) {};

  var setVolume = function (volume) {};
  var mute = function () {};
  var unMute = function () {};

  // access to player state
  var isCreated = function () {};
  var isPlaying = function () {};
  var getAlbum = function () {};
  var getTrackIndex = function () {};
  var getTrack = function () {};
  var getTime = function () {};
  var getDuration = function () {};

  // buffering information returns object with two keys:
  // fractionBuffered, fractionStartingAt (both real-valued between
  // 0.0 and 1.0)
  var getBufferStatus = function () {};

  // arrays of callbacks to album setup; callbacks take no arguments
  var onAlbumSetup = [];

  // array of callbacks to track change; callbacks take no arguments
  // Note that these will *also* be called when the album is setup.
  var onTrackChanged = [];

  // arrays of callbacks to media player time advancing (or otherwise changing)
  // callbacks take no arguments
  var onTimeChanged = [];

  // arrays of callbacks to state change (i.e. start/stop); callbacks take
  // no arguments
  var onStateChanged = [];


// ========================
// Visualizer

  // for animation that has already been set up, jump to specified time.
  // optionally, set argument 'animate' to animate transition (e.g. for
  // standard time-advance while track is playing)
  var setTime = function (time, animate) {};

// ======================
// PlaybackControls

  // check whether user is in the midst of dragging the playback point
  var isManuallySeeking = function () {};

// ======================
// AlbumControls

  var setup = function (album) {};

