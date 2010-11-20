/*jslint indent:2, browser:true, onevar:false */

var parseWikipediaText = function (text) {
  var album = [],
      currentTrack = null,
      trackPattern = /(\d+). "(.*)"/,
      samplePattern = /(\d+):(\d+) (.*) - "([^"]*)"/;
  $.each(text.split('\n'), function (index, line) {
    line = line.replace(/\[.*\]/g, "");
    var sampleResults = line.match(samplePattern);
    if (sampleResults) {
      currentTrack.samples.push({
        start: 60 * parseInt(sampleResults[1]) + parseInt(sampleResults[2]),
        artist: sampleResults[3],
        title: sampleResults[4]
      });
    } else {
      var trackResults = line.match(trackPattern);
      if (!trackResults) {
        return;
      }
      currentTrack = trackData[parseInt(trackResults[1]) - 1];
      currentTrack.samples = [];
      album.push(currentTrack);
    }
  });
  return album;
};

var albumFromWikipedia = "";

// We don't have end times yet.  So for now, set all sample durations to 30

var addEndTimesToSamples = function (album) {
  $.each(album, function (i, track) {
    $.each(track.samples, function (j, sample) {
      if (!sample.end) {
        sample.end = Math.min(sample.start + 30, track.duration);
      }
    });
  });
};

