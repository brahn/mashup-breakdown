// =====================
// AlbumData

  // Provides the track and sample data for the current album.

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

  // Clear all cached data
  var clearCache = function () {};

  // Callbacks to data change, which might result from setSource or
  // reloadData.  Callbacks take no arguments.
  var onDataChanged = [];

// =====================
// YouTube, SCloud

// Interfaces to YouTube and SoundCloud APIs.  Called only by MediaPlayer

// ======================
// MediaPlayer

  // XXX When playing track ends, automatically advances to next track

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

  // buffering status: returns an object with three fields:
  // (follows YouTube's byte status stuff)
  // * loaded
  // * total
  // * startingAt
  var getByteStatus = function () {};

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

  // XXX haven't dealt with buffering yet


// ========================
// Visualizer

  // for animation that has already been set up, jump to specified time.
  // optionally, set argument 'animate' to animate transition (e.g. for
  // standard time-advance while track is playing)
  var setTime = function (time, animate) {};

// ======================
// Controls

  // setup selectors for tracks and data source options
  var setupAlbum = function (album) {};


