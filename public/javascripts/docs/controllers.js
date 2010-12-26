// =====================
// AlbumData

  // Pulls track and sample data from data source

  // Set the data source object on which data is based.
  // By default, data will be pulled from cache if it is available.
  // To ignore cached version and reload data, set forceReload to true.
  var setSource = function (source, forceReload) {};

  // Returns current data _source_ object
  var getSource = function () {};

  // Returns current data.  The returned object has two fields:
  // * results.tracks -- array of track objects
  // * results.samples -- album sample data object
  var getData = function () {};

  // Clear all stored data
  var clearCache = function () {};

  // Callbacks to data change, which would result from setSource
  var onDataChanged = [];

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

  var setupAlbum = function (album) {};

