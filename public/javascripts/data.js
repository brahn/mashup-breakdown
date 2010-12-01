/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, safeLogger, eachKey */

var ALL_DAY_ALBUM = {
  artist: "Girl Talk",
  title: "All Day",
  mediaType: "youtube",
  tracks: [
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
  ],
  sampleDataSources: [
    { id: "wikipedia-snapshot",
      prettyText: "Wikipedia (Nov. 29)",
      type: "text",
      url: "/javascripts/data/wikipedia.txt"
    },
    { id: "wikipedia-live",
      prettyText: "Wikipedia (live)",
      type: "wikipedia",
      pageName: "All_Day_(album)"
    }
  ]
};

var AlbumData = (function () {

  // stores cached data for an album, keyed by data source id
  var m_data = {};

  var clearCache = function () {
    m_data = {};
  };

// ==========================================
// SAMPLE DATA FROM TEXT FILE

  var parseText = function (text) {
    var trackData = [],
        sampleData = [],
        currentTrackSamples = null,
        trackPattern = /^(\d+)\. "(.*)"/,
        samplePattern = /(\d+):(\d+) - (\d+):(\d+) (.*) - "([^"]*)"/,
        samplePatternNoStop = /(\d+):(\d+)(\s-\s\?:\?\?)?\s([^ -].*) - "([^"]*)"/;
    var lines = text.split('\n');
    $.each(lines, function (index, line) {
      line = line.replace(/\[.*\] */g, "");
      var sampleResults = line.match(samplePattern);
      if (sampleResults) {
        currentTrackSamples.push({
          start: 60 * parseInt(sampleResults[1]) + parseInt(sampleResults[2]),
          end: 60 * parseInt(sampleResults[3]) + parseInt(sampleResults[4]),
          artist: sampleResults[5],
          title: sampleResults[6]
        });
        return;
      }
      sampleResults = line.match(samplePatternNoStop);
      if (sampleResults) {
        currentTrackSamples.push({
          start: 60 * parseInt(sampleResults[1]) + parseInt(sampleResults[2]),
          artist: sampleResults[4],
          title: sampleResults[5]
        });
        return;
      }
      var trackResults = line.match(trackPattern);
      if (trackResults) {
        trackData.push({
          title: trackResults[2]
        });
        currentTrackSamples = [];
        sampleData.push(currentTrackSamples);
      }
    });
    return {
      tracks: trackData,
      samples: sampleData
    };
  };

  // We don't have end times yet.  So for now, set all sample durations to 30

  var addEndTimesToSamples = function (albumSamples, albumTracks) {
    $.each(albumSamples, function (i, trackSamples) {
      $.each(trackSamples, function (j, sample) {
        if (!sample.end) {
          sample.end = Math.min(sample.start + 30, ALL_DAY_ALBUM.tracks[i].duration);
        }
      });
    });
  };

  // successFunc takes the resulting album object as an argument
  var getDataFromText = function (fileUrl, successFunc) {
    $.get(fileUrl, function (text) {
      var results = parseText(text);
      addEndTimesToSamples(results.samples, results.tracks);
      successFunc(results);
    });
  };

// ===============================================
// SAMPLE DATA FROM WIKIPEDIA

  var getDataFromWikipedia = function (pageName, successFunc) {
    $.getJSON('http://en.wikipedia.org/w/api.php?action=parse&page=' +
              encodeURIComponent(pageName) +
              '&prop=text&format=json&callback=?', function (json) {
      var text = $('<div></div>').html((json.parse.text["*"])).find('h3, ul').text();
      var results = parseText(text);
      addEndTimesToSamples(results.samples, results.tracks);
      successFunc(results);
    });
  };

// =================================
// INTERFACE

  // use sample data from a particular ource;
  var get = function (source, forceReload, successFunc) {
    if (m_data[source.id] && !forceReload) {
      // we've already retrieved this album's data, so don't do it again.
      successFunc(m_data[source.id]);
    } else if (source.type === "wikipedia") {
      getDataFromWikipedia(source.pageName, function (results) {
        m_data[source.id] = results;
        successFunc(results);
      });
    } else if (source.type === "text") {
      getDataFromText(source.url, function (results) {
        m_data[source.id] = results;
        successFunc(results);
      });
    }
  };

  return {
    get: get,
    clearCache: clearCache
  };

}());