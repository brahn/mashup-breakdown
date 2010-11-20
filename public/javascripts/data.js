/*jslint indent:2, browser:true, onevar:false */

var Data = (function () {

// ===========================================
// TRACK DATA

  var m_tracks = [
    {title: "Oh No", ytId: "4bMM7tGV9MI", duration: 339},
    {title: "Let It Out", ytId: "FtsxfquYHf0", duration: 389},
    {title: "That's Right", ytId: "xVmXXWcfitw", duration: 323},
    {title: "Jump on Stage", ytId: "Ka3GznTXur8", duration: 382},
    {title: "This Is the Remix", ytId: "DZu_lLGFDtM", duration: 362},
    {title: "On and On", ytId: "lzf8NNF1Af4", duration: 309},
    {title: "Get It Get It", ytId: "MRCEgD1nRRM", duration: 333},
    {title: "Down for the Count", ytId: "Nr2cfwR0roU", duration: 398},
    {title: "Make Me Wanna", ytId: "9DBmMoW5lSs", duration: 383},
    {title: "Steady Shock", ytId: "p1pd69r1Il8", duration: 348},
    {title: "Triple Double", ytId: "i0yY0zxk-18", duration: 388},
    {title: "Every Day", ytId: "Bo5bBq2j2EE", duration: 311}
  ];

  // store album data from different sources in m_albums. keys
  // * "wikipedia"
  // * "allDaySamples"
  var m_albums = {};

// ==========================================
// SAMPLE DATA FROM WIKIPEDIA
// Assumes the existence of javascripts/data/wikipedia.txt

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
        currentTrack = m_tracks[parseInt(trackResults[1]) - 1];
        currentTrack.samples = [];
        album.push(currentTrack);
      }
    });
    return album;
  };

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

  // successFunc takes the resulting album object as an argument
  var getAlbumFromWikipediaText = function (successFunc) {
    $.get("/javascripts/data/wikipedia.txt", function (results) {
      var album = parseWikipediaText(results);
      addEndTimesToSamples(album);
      successFunc(album);
    });
  }; 

// ======================================
// SAMPLE DATA FROM ALLDAYSAMPLES.COM
// Assumes that data/alldaysamples.js has been called, and sets
// the global variable allDaySamplesArray

  // allDaySamplesArray the above is not in our preferred format.  Let's
  // fix that.

  var convertToAlbumFormat = function (data) {
    var album = [];
    $.each(data, function (index, trackArray) {
      var track = {
        title: m_tracks[index].title,
        duration: m_tracks[index].duration,
        ytId: m_tracks[index].ytId,
        samples: []
      };
      $.each(trackArray, function (index, sampleArray) {
        track.samples.push({
          start: sampleArray[0] / 1000.0,
          end: sampleArray[1] / 1000.0,
          artist: sampleArray[2],
          title: sampleArray[3]
        });
      });
      album.push(track);
    });
    return album;
  };

  // Use a callback to match format of wikipedia get, which
  // is actually ajax
  var getAlbumFromAllDaySamples = function (successFunc) {
    successFunc(convertToAlbumFormat(allDaySamplesArray));
  };

// =================================
// INTERFACE

  var tracks = function () {
    return m_tracks;
  };

  // use sample data from a particular ource;
  var getAlbum = function (source, successFunc) {
    if (m_albums[source]) {
      // we've already retrieved this album's data, so don't do it again.
      successFunc(m_albums[source]);
    } else if (source === "allDaySamples") {
      getAlbumFromAllDaySamples(function (resultingAlbum) {
        m_albums[source] = resultingAlbum;
        successFunc(m_albums[source]);
      });
    } else {
      getAlbumFromWikipediaText(function (resultingAlbum) {
        m_albums[source] = resultingAlbum;
        successFunc(m_albums[source]);
      });
    }
  };

  return {
    tracks: tracks,
    getAlbum: getAlbum
  };

}());