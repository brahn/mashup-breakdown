/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, Data, Controls, asPercentage, safeLogger, eachKey */
/*global allDaySamplesArray */

var AlbumData = (function () {

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
  // * "live-wikipedia"
  var m_albums = {};

// ==========================================
// SAMPLE DATA FROM WIKIPEDIA
// Assumes the existence of javascripts/data/wikipedia.txt

  var parseWikipediaText = function (text) {
    var album = [],
        currentTrack = null,
        trackPattern = /^(\d+)\. "(.*)"/,
        samplePattern = /(\d+):(\d+) - (\d+):(\d+) (.*) - "([^"]*)"/,
        samplePatternNoStop = /(\d+):(\d+)(\s-\s\?:\?\?)?\s([^ -].*) - "([^"]*)"/;
    var lines = text.split('\n');
    $.each(lines, function (index, line) {
      safeLogger(line);
      line = line.replace(/\[.*\] */g, "");
      var sampleResults = line.match(samplePattern);
      if (sampleResults) {
        safeLogger("*** sample with stop time ***");
        currentTrack.samples.push({
          start: 60 * parseInt(sampleResults[1]) + parseInt(sampleResults[2]),
          end: 60 * parseInt(sampleResults[3]) + parseInt(sampleResults[4]),
          artist: sampleResults[5],
          title: sampleResults[6]
        });
        return;
      }
      sampleResults = line.match(samplePatternNoStop);
      if (sampleResults) {
        safeLogger("*** sample without stop time ***");
        currentTrack.samples.push({
          start: 60 * parseInt(sampleResults[1]) + parseInt(sampleResults[2]),
          artist: sampleResults[4],
          title: sampleResults[5]
        });
        return;
      }
      var trackResults = line.match(trackPattern);
      if (trackResults) {
        safeLogger("*** track ***");
        var trackIndex = parseInt(trackResults[1]) - 1;
        if (m_tracks.length > trackIndex) {
          currentTrack = shallowClone(m_tracks[trackIndex]);
        } else {
          currentTrack = {title: trackResults[2]};
        }
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
  var getAlbumFromWikipediaText = function (fileUrl, successFunc) {
    $.get(fileUrl, function (results) {
      var album = parseWikipediaText(results);
      addEndTimesToSamples(album);
      successFunc(album);
    });
  };

  var getLiveWikipedia = function (successFunc) {
    var page = 'All_Day_(album)';
    $.getJSON('http://en.wikipedia.org/w/api.php?action=parse&page=' +
              encodeURIComponent(page) +
              '&prop=text&format=json&callback=?', function (json) {
      var text = $('<div></div>').html((json.parse.text["*"])).find('h3, ul').text();
      var album = parseWikipediaText(text);
      addEndTimesToSamples(album);
      successFunc(album);
    });
  };

// =================================
// INTERFACE

  var tracks = function () {
    return m_tracks;
  };

  // use sample data from a particular ource;
  var getAlbum = function (source, forceReload, successFunc) {
    if (m_albums[source] && !forceReload) {
      // we've already retrieved this album's data, so don't do it again.
      successFunc(m_albums[source]);
    } else if (source === "live-wikipedia") {
      getLiveWikipedia(function (resultingAlbum) {
        m_albums[source] = resultingAlbum;
        successFunc(m_albums[source]);
      });
    } else {
      getAlbumFromWikipediaText("/javascripts/data/wikipedia.txt",
        function (resultingAlbum) {
        m_albums[source] = resultingAlbum;
        successFunc(m_albums[source]);
      });
    }
  };

  var logAlbum = function (album) {
    $.each(album, function (trackIndex, track) {
      safeLogger("****************");
      safeLogger("Track " + (trackIndex + 1) + " - " + track.title);
      $.each(track.samples, function (sampleIndex, sample) {
        var str = "";
        eachKey(sample, function (key, val) {
          str += key + ": " + val + ";  ";
        });
        safeLogger(str);
      });
    });
  };

  return {
    // exposed for testing
    logAlbum: logAlbum,
    albums: m_albums,

    tracks: tracks,
    getAlbum: getAlbum
  };

}());