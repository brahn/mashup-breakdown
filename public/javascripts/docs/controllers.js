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

  // Callbacks to data change, which would result from setSource
  var onDataChanged = [];

// =====================
// YouTube
// Interface to YouTube API; called only by MediaPlayer.

  // Create the YouTube flash object.  Options object can take the
  // following fields (defaults)
  // * ytId ("Srmdij0CU1U") -- id of video to be cued, default is test pattern
  // * divToReplace ($("#yt-player-standin"));
  // * playerObjectId ("yt-player")
  // * playWhenCued (false)
  // * createFailureCallback (null function)
  var setup = function (options) {};

  // Callbacks to YouTube flash object creation; take no arguments.
  var onReady = [];

  // Callbacks to YouTube flash object state change.  See
  // http://code.google.com/apis/youtube/js_api_reference.html#Events
  // Callback functions take the state as the argument: possible
  // values are unstarted (-1), ended (0), playing (1), paused (2),
  // buffering (3), video cued (5).
  var onStateChanged = [];

  // Callbacks to a new video being loaded (including when player
  // becomes ready for the first time).  Note that if a video is cued,
  // and then re-cued, these callbacks still fire.
  var onVideoChanged = [];

  var resize = function (width, height) {};

  // cue movies, don't automatically play
  var cue = function (ytId) {};
  var cueByUrl = function (ytUrl) {};
  // cue movies and play when ready
  var load = function (ytId) {};
  var loadByUrl = function (ytUrl) {};

  var play = function () {};
  var pause = function () {};

  // http://code.google.com/apis/youtube/js_api_reference.html#Functions
  // recommend that you set 'allowSeekAhead' to false while the user
  // is dragging the mouse along a video progress bar and then set the
  // parameter to true when the user releases the mouse.
  var seekTo = function (seconds, allowSeekAhead) {};

  var setVolume = function (volume) {};
  var mute = function () {};
  var unmute = function () {};

  // returns an object with three fields
  // * total (bytes in video)
  // * loaded (bytes buffered)
  // * startingAt (where the buffering begins)
  var byteStatus = function () {};

  var isCreated = function () {};
  var state = function () {};
  var isPlaying = function () {};
  var currentTime = function () {};
  var videoUrl = function () {};
  var duration = function () {};

// =====================
// SoundCloud

  // Creates the soundcloud flash object.
  // options object can take the following fields (defaults)
  // * scUrl ("http://soundcloud.com/forss/flickermood") -- url of track
  //     to be cued, default track is mostly harmless
  // * divToReplace ($("#sc-player-standin"));
  // * playerObjectId ("sc-player")
  // * playWhenCued (false)
  // * createFailureCallback (null function)
  var setup = function (options) {};

  // Callbacks to SoundCloud flash object creation; take no arguments.
  // NB: this is different from the SoundCloud onPlayerReady event, which
  // fires every time a new track is cued.
  var onReady = [];

  // Callbacks to state changed; arguments are values of the state.
  // Possible values: "playing", "paused", "ended" or null/undefined
  var onStateChagned = [];


  var cueByUrl = function (scUrl) {};
  var loadByUrl = function (scUrl) {};

  var play = function () {};
  var pause = function () {};
  var seekTo = function (seconds) {};
  var setVolume = function (volume) {};
  var mute = function () {};
  var unMute = function () {};

  var isCreated = function () {};
  var isPlaying = function () {};
  // Possible state values: "playing", "paused", "ended" or null/undefined
  var state = function () {};
  var currentTime = function () {};
  var duration = function () {};

  // returns an object with the field "percentLoaded" (integer 0-100)
  var bufferStatus = function () {};




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

  // buffering status: returns an object with three fields:
  // (follows YouTube's byte status stuff)
  // * loaded
  // * total
  // * startingAt
  var byteStatus = function () {};

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

  var isManuallySeeking = function () {};

