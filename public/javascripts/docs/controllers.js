// ========================
// Visualizer

  // for animation that has already been set up, jump to specified time.
  // optionally, set argument 'animate' to animate transition (e.g. for
  // standard time-advance while track is playing)
  var setTime = function (time, animate) {};

  // call to redraw samples.  Optionally, set argument 'time' to establish
  // visualization as if mid-track
  var setup = function (samples, trackDuration, time) {};

// ======================
// PlaybackControls

  // call to set up for track of given duration
  var setup = function (duration) {};

// =====================
// AlbumData

  // successFunc callback takes returned album as an argument
  var get = function (sampleDataSource, successFunc) {};

// ======================
// MediaPlayer

  // XXX When playing track ends, automatically advances to next track

  // Initialize player with specified album.
  // options can carry the following optional fields (defaults in parens)
  // * playWhenCued (default)
  // * failureCallback (null function)
  // * startAtTrack (0) XXX not yet implemented
  // * startAtTime (0) XXX not yet implemented
  var setupAlbum = function (album, options) {};

  var play = function () {};
  var pause = function () {};
  // keys for option object
  // * allowSeekAhead (youtube-specific)
  var seekTo = function (time, options) {};
  var gotoTrack = function (trackNum) {};

  var setVolume = function (volume) {};
  var mute = function () {};
  var unMute = function () {};

  // access to player state
  var getAlbum = function () {};
  var getTrackNum = function () {};
  var getCurrentTrack = function () {};
  var getTime = function () {};
  var isPlaying = function () {};

  // arrays of callback to album setup; callbacks take no arguments
  var onAlbumSetup = [];

  // array of callbacks to track change; callbacks take new track number
  var onTrackChange = [];

  // XXX haven't dealt with buffering yet


// =====================
// YouTube, SCloud

// Interfaces to YouTube and SoundCloud APIs.  Called only by MediaPlayer

// =====================
// AlbumControls

  // Track selector
  // - Change in drop-down triggers changing tracks
  // - Track transition from MediaPlayer changes selector

  // Data selector
  // - Change in drop-down gathers new sample data, updates *visualizer*
  //   but not media player