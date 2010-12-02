/*jslint indent:2, browser:true, onevar:false regexp:false */
/*global $, window, sendEvent, safeLogger, eachKey */

var ALL_DAY_ALBUM = {
  artist: "Girl Talk",
  title: "All Day",
  mediaType: "youtube",
  tracks: [
    {ytId: "4bMM7tGV9MI", duration: 339},
    {ytId: "FtsxfquYHf0", duration: 389},
    {ytId: "xVmXXWcfitw", duration: 323},
    {ytId: "Ka3GznTXur8", duration: 382},
    {ytId: "DZu_lLGFDtM", duration: 362},
    {ytId: "lzf8NNF1Af4", duration: 309},
    {ytId: "MRCEgD1nRRM", duration: 333},
    {ytId: "Nr2cfwR0roU", duration: 398},
    {ytId: "9DBmMoW5lSs", duration: 383},
    {ytId: "p1pd69r1Il8", duration: 348},
    {ytId: "i0yY0zxk-18", duration: 388},
    {ytId: "Bo5bBq2j2EE", duration: 311}
  ],
  sampleDataSources: [
    { id: "wikipedia-snapshot",
      prettyText: "Wikipedia (Dec. 2)",
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
          title: trackResults[2],
          duration: ALL_DAY_ALBUM.tracks[trackData.length].duration           // XXX not the right way to do this
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

  // Data source on which returned data is currently based.
  var m_currentSource = null;

  // callbacks to data changes
  var onDataChanged = [];

  var getSource = function () {
    return m_currentSource;
  };

  var getData = function () {
    return m_data[m_currentSource.id];
  };

  var clearCache = function () {
    m_data = {};
    m_currentSource = null;
  };

  // use sample data from a particular source;
  var setSource = function (source, forceReload) {
    if (m_data[source.id] && !forceReload) {
      // we've already retrieved this album's data, so don't do it again.
      m_currentSource = source;
      sendEvent(onDataChanged);
    } else if (source.type === "wikipedia") {
      getDataFromWikipedia(source.pageName, function (results) {
        m_currentSource = source;
        m_data[source.id] = results;
        sendEvent(onDataChanged);
      });
    } else if (source.type === "text") {
      getDataFromText(source.url, function (results) {
        m_currentSource = source;
        m_data[source.id] = results;
        sendEvent(onDataChanged);
      });
    }
  };

  return {
    onDataChanged: onDataChanged,
    setSource: setSource,
    getSource: getSource,
    getData: getData,
    clearCache: clearCache
  };

}());