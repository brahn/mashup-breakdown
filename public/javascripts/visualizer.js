/*jslint indent:2, browser:true, onevar:false */
/*global $, window, YouTube, asPercentage */

var Visualizer = (function () {

// ======================================
// SAMPLE DIV

  var samplesDiv = null;

  var WIDTH_MULTIPLIER = 1;

  var setupSamplesDiv = function () {
    samplesDiv = $("#samples").width((WIDTH_MULTIPLIER * 100) + "%").empty();
  };

// ======================================
// ASSIGNING STRIPS

  // To lay out the samples, we first assign each sample to a strip that
  // runs across the page.
  // We use a naive algorithm: Loop through the samples in order (sorted
  // by start time). For each sample, put it in the first strip that
  // is available at the sample's start time.

  var totalStrips;

  // Checks if the supplied time is between the start and stop times of
  // of the sample.  optional parameter fudgeFactor expands (if positive)
  // or shrinks (if negative) the sample by fudgeFactor on both ends.
  var isTimeInSample = function (sample, time, fudgeFactor) {
    fudgeFactor = fudgeFactor || 0;
    return (time >= (sample.start - fudgeFactor)) && 
      (time <= (sample.end + fudgeFactor));
  };

  // This is inefficient, not that it matters.
  var setSampleStrips = function (track) {
    totalStrips = 0;
    $.each(track.samples, function (index, sample) {
      // identify all strips already in use at sample start time
      var stripsInUse = {};
      $.each(track.samples, function (index, sample2) {
        if (sample2.strip !== undefined &&
          isTimeInSample(sample2, sample.start)) {
          stripsInUse[sample2.strip] = true;
        }
      });
      // find the first strip not in use, and assign it to the sample
      var stripNum = 0;
      while (stripsInUse[stripNum]) {
        stripNum += 1;
      }
      sample.strip = stripNum;
      // update totalStrips if this creates a new strip
      if (stripNum >= totalStrips) {
        totalStrips = stripNum + 1;
      }
    });
  };

// ============================================
// REPRESENTING SAMPLES AS VISUAL BLOCKS

  var VERTICAL_PADDING_PERCENTAGE = 10.0;

  var blockHeight, blockVerticalPadding; // expressed as a %age of div#samples

  var createSampleBlock = function (sample, trackDuration) {
    return $('#sample-block-template').tmpl(sample).css({
      top: (sample.strip * blockHeight +
             (2 * sample.strip + 1) * blockVerticalPadding) + "%",
      height: blockHeight + "%",
      left: asPercentage(1.0 * sample.start / trackDuration) + "%",
      right: asPercentage(1 - 1.0 * sample.end / trackDuration) + "%"
    }).addClass("strip-" + (sample.strip % 6));
  };

  var setupSampleBlocks = function (track) {
    blockVerticalPadding = VERTICAL_PADDING_PERCENTAGE / totalStrips;
    blockHeight = (100.0 - 2 * VERTICAL_PADDING_PERCENTAGE) / totalStrips;
    $.each(track.samples, function (index, sample) {
      sample.block = createSampleBlock(sample, track.duration);
      $('#samples').append(sample.block);
    });
  };

// ==========================================
// TIME-DEPENDENT EFFECTS

  var duration;

  var setTime = function (time) {
    samplesDiv.css("left",
      -100.0 * (WIDTH_MULTIPLIER - 1) * (time / duration) + "%");
  };

// ===========================================

  var setup = function (track) {
    duration = track.duration;
    setupSamplesDiv();
    setSampleStrips(track);
    setupSampleBlocks(track);
  };

  return {
    setup: setup,
    setTime: setTime
  };

}());

