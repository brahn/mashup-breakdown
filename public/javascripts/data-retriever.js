/*jslint indent:2, browser:true, onevar:false regexp:false */
/*global $, window, sendEvent, safeLogger, eachKey, timeStrToSec */

var DataRetriever = (function () {

  // stores cached data for an album, keyed by data source id
  var m_data = {};

// ==========================================
// SAMPLE DATA FROM TEXT FILE

  var parseText = function (text) {
    var trackData = [],
        sampleData = [],
        currentTrackSamples = null,
        trackPattern = /^(\d+)\.\s"([^"]*)"\s-\s([0-9:]+)/,
        samplePattern = /^([0-9:]+)\s-\s([0-9:]+)\s(.*)\s-\s"([^"]*)"/,
        samplePatternNoStop = /^([0-9:]+)\s(.*)\s-\s"([^"]*)"/;
    var lines = text.split('\n');
    $.each(lines, function (index, line) {
      line = line.replace(/\[.*\] */g, "");
      var sampleResults = line.match(samplePattern);
      if (sampleResults) {
        currentTrackSamples.push({
          start: timeStrToSec(sampleResults[1]),
          end: timeStrToSec(sampleResults[2]),
          artist: sampleResults[3],
          title: sampleResults[4]
        });
        return;
      }
      sampleResults = line.match(samplePatternNoStop);
      if (sampleResults) {
        currentTrackSamples.push({
          start: timeStrToSec(sampleResults[1]),
          artist: sampleResults[2],
          title: sampleResults[3]
        });
        return;
      }
      var trackResults = line.match(trackPattern);
      if (trackResults) {
        trackData.push({
          title: trackResults[2],
          duration: timeStrToSec(trackResults[3])
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
          sample.end = Math.min(sample.start + 30, albumTracks[i].duration);
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

// ============================================
// SAMPLE DATA VIA JSON

  var getDataFromJSON = function (jsonURL, successFunc) {
    $.getJSON(jsonURL, function (results) {
      successFunc(results);
    });
  };

// =================================
// INTERFACE

  var clearCache = function () {
    m_data = {};
  };

  // use sample data from a particular source;
  var getFromSource = function (source, forceReload, successFunc) {
    if (m_data[source.id] && !forceReload) {
      // we've already retrieved this album's data, so don't do it again.
      successFunc(m_data[source.id]);
    } else if (source.type === "wikipedia") {
      getDataFromWikipedia(source.pageName, function (results) {
        m_data[source.id] = results;
        successFunc(m_data[source.id]);
      });
    } else if (source.type === "text") {
      getDataFromText(source.url, function (results) {
        m_data[source.id] = results;
        successFunc(m_data[source.id]);
      });
    } else if (source.type === "json") {
      getDataFromJSON(source.url, function (results) {
        m_data[source.id] = results;
        successFunc(m_data[source.id]);
      });
    }
  };

  return {
    getFromSource: getFromSource,
    clearCache: clearCache
  };

}());