/*jslint indent:2, browser:true, onevar:false */
/*global $, window, MediaPlayer, asPercentage, Album, safeLogger */
/*global PlaybackControls */

var Visualizer = (function () {

  var m_samples, m_duration;

  var m_featureVideo = false;

// ======================================
// SAMPLE DIV

  var samplesDiv = null;

  var m_widthMultiplier = 1;

  var clearToolTips = function () {
    $('.tipsy').remove();
  };

  var setupSamplesDiv = function () {
    clearToolTips();
    var time = currentTime || 0;
    samplesDiv = $("#samples").empty().width((m_widthMultiplier * 100) + "%").
      css({left: -100.0 * (m_widthMultiplier - 1) * (time / m_duration) + "%"});
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

  var clearSampleStrips = function () {
    $.each(m_samples, function (index, sample) {
      sample.strip = undefined;
    });
  };

  // This is inefficient, not that it matters.
  var setSampleStrips = function () {
    clearSampleStrips();
    totalStrips = 0;
    var currentSampleGroup = 0,
        currentSampleGroupMinStripNum = 0;
    $.each(m_samples, function (index, sample) {
      // check if this is a new sampleGroup
      if (sample.sampleGroup !== currentSampleGroup) {
        // if so, begin laying out samples in a new set of strips
        currentSampleGroupMinStripNum = totalStrips;
        currentSampleGroup = sample.sampleGroup;
      }
      // identify all strips already in use at sample start time
      var stripsInUse = {};
      $.each(m_samples, function (index, sample2) {
        if (sample2.strip !== undefined && sample2.strip !== null &&
          isTimeInSample(sample2, sample.start)) {
          stripsInUse[sample2.strip] = true;
        }
      });
      // find the first strip not in use, and assign it to the sample
      var stripNum = currentSampleGroupMinStripNum;
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

  var VERTICAL_PADDING_PERCENTAGE = 4.0;

  var blockHeight, blockVerticalPadding; // expressed as a %age of div#samples

  var tooltipHTML = function (sample) {
    return sample.artist + "<br />" + sample.title;
  };

  var MINIMUM_VISUAL_SAMPLE_LENGTH = 1;

  var createSampleBlock = function (sample) {
    var start = sample.start,
        end = sample.end;
    // force samples to be visually represented as at least 1 second long
    if (end - start < MINIMUM_VISUAL_SAMPLE_LENGTH) {
      end = start + MINIMUM_VISUAL_SAMPLE_LENGTH;
    }
    return $('<div></div>').
      addClass("sample-block strip-" + (sample.strip % 6)).
      css({
        top: (sample.strip * blockHeight +
               (2 * sample.strip + 1) * blockVerticalPadding) + "%",
        height: blockHeight + "%",
        left: asPercentage(1.0 * start / m_duration),
        right: asPercentage(1 - 1.0 * end / m_duration)
      }).
      addClass(sample.flagged ? "flagged" : "").
      tipsy({
        trigger: 'hoverWithOverride',
        tipHover: true,
        gravity: 'c',
        html: true,
        fallback: tooltipHTML(sample),
        opacity: m_featureVideo ? 0.8 : 0.8
      });
  };

  var activateBlock = function (block, animate) {
    var newOpacity = m_featureVideo ? 0.8 : 1.0;
    if (animate) {
      block.tipsy("enableFade");
      block.tipsy("showWithOverride");
      block.stop().animate({opacity: newOpacity});
    } else {
      block.tipsy("disableFade");
      block.tipsy("showWithOverride");
      block.stop().css("opacity", newOpacity);
    }
  };

  var deactivateBlock = function (block, animate) {
    var newOpacity = m_featureVideo ? 0.2 : 0.2;
    if (animate) {
      block.tipsy("enableFade");
      block.tipsy("hide");
      block.stop().animate({opacity: newOpacity});
    } else {
      block.tipsy("disableFade");
      block.stop().css("opacity", newOpacity).tipsy("hide");
    }
  };

  var setupSampleBlocks = function () {
    blockVerticalPadding = VERTICAL_PADDING_PERCENTAGE / totalStrips;
    blockHeight = (100.0 - 2 * VERTICAL_PADDING_PERCENTAGE) / totalStrips;
    $.each(m_samples, function (index, sample) {
      sample.block = createSampleBlock(sample);
      $(sample.block).data("sample", sample);
      deactivateBlock(sample.block);
      $('#samples').append(sample.block);
    });
  };

// ==========================================
// TIME-DEPENDENT EFFECTS

  var updateSampleActivity = function (time, animate, forceRedoEffect) {
    if (!m_samples) {
      return;
    }
    $.each(m_samples, function (index, sample) {
      if (isTimeInSample(sample, time)) {
        if (!sample.block.hasClass("active") || forceRedoEffect) {
          sample.block.addClass("active");
          activateBlock(sample.block, animate);
        }
      } else if (sample.block.hasClass("active") || forceRedoEffect) {
        sample.block.removeClass("active");
        deactivateBlock(sample.block, animate);
      }
    });
  };

  var currentTime;

  var setTime = function (time, animate) {
    currentTime = time;
    updateSampleActivity(time, animate);
    if (m_widthMultiplier !== 1) {
      samplesDiv.stop().animate({left: 
        -100.0 * (m_widthMultiplier - 1) * (time / m_duration) + "%"});
    }
  };

  var getTime = function () {
    return currentTime;
  };

  MediaPlayer.onTimeChanged.push(function () {
    if (!PlaybackControls.isManuallySeeking()) {
      setTime(MediaPlayer.getTime(), true);
    }
  });

// ===========================================

  var MINIMUM_SAMPLE_TIME = 0.7;

  var refresh = function (time) {
    var samples = Album.getCurrentTrack("samples"),
        trackDuration = Album.getCurrentTrack("duration");
    time = time || MediaPlayer.getTime();
    if (!samples || !trackDuration) {
      return;
    }
    m_featureVideo = Album.get("featureVideo");
    $('.tipsy').remove();
    m_duration = trackDuration;
    // make sure samples are sorted by sample group and then by start time
    m_samples = samples.sort(function (a, b) {
      if ((1.0 * a.sampleGroup !== 1.0 * b.sampleGroup)) {
        return a.sampleGroup - b.sampleGroup;
      } else if ((1.0 * a.start) !== (1.0 * b.start)) {
        return a.start - b.start;
      } else if ((1.0 * a.end) !== (1.0 * b.end)) {
        return a.end - b.end;
      } else if (a.artist !== b.artist) {
        return (a.artist > b.artist) ? 1 : -1;
      } else if (a.title < b.title) {
        return (a.title > b.title) ? 1 : -1;
      } else {
        return -1;
      }
    });
    // make sure sample length is at least 0.5sec for purposes of timing
    $.each(m_samples, function (index, sample) {
      if (sample.end - sample.start < MINIMUM_SAMPLE_TIME) {
        sample.end = sample.start + MINIMUM_SAMPLE_TIME;
      }
    });
    setupSamplesDiv();
    setSampleStrips();
    setupSampleBlocks();
    if (time !== null && time !== undefined) {
      setTime(time);
    }
  };
  Album.onDataChanged.push(refresh);
  MediaPlayer.onTrackChanged.push(refresh);

  var setWidthMultiplier = function (val) {
    m_widthMultiplier = val;
    refresh(currentTime);
  };

  $(document).ready(function () {
    $(window).resize(function () {
      waitForFinalEvent(function () {
        if (currentTime !== undefined) {
          clearToolTips();
          updateSampleActivity(currentTime, false, true);
        }
      }, WINDOW_RESIZE_CALLBACK_DELAY, "updateSampleActivity");
    });
  });

  return {
    setTime: setTime,
    getTime: getTime,
    activateBlock: activateBlock,
    deactivateBlock: deactivateBlock,
    refresh: refresh,
    setWidthMultiplier: setWidthMultiplier
  };

}());

