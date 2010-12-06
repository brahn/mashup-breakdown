/*jslint indent:2, browser:true, onevar:false */
/*global $, window */

var asPercentage = function (x, numDecimals) {
  if (numDecimals === undefined) {
    numDecimals = 1;
  }
  return (Math.round(100.0 * Math.pow(10, numDecimals) * x) /
    Math.pow(10, numDecimals)) + "%";
};

var secToMmss = function (time) {
  time = time ? parseInt(time, 10) : 0;
  var mins = Math.floor(time / 60, 10),
      secs = time - mins * 60;
  return mins + ":" + (secs < 10 ? '0' + secs : secs);
};

/* Requires at least one colon separating minutes and seconds.
 * Hours and decimals of seconds optional; decimals kept to milliseconds */
var timeStrPattern = /((\d*):)?(\d*):(\d*)(\.(\d*))?/;

var timeStrToSec = function (timeStr) {
  var results = timeStr.match(timeStrPattern);
  if (!results) {
    return null;
  }
  var fraction = 0;
  if (results[6]) {
    var decimalStr = results[6].slice(0,3);
    fraction = parseInt(decimalStr, 10) / Math.pow(10, decimalStr.length);
  }
  return 3600 * (parseInt(results[2], 10) || 0) +
    60 * (parseInt(results[3], 10) || 0) +
    (parseInt(results[4], 10) || 0) + fraction;
};

var safeLogger = function (str) {
  if (window.console && window.console.log) {
    window.console.log(str);
  }
};

// swiped from prototype
var $A = function (iterable) {
  if (!iterable) {
    return [];
  }
  if ('toArray' in Object(iterable)) {
    return iterable.toArray();
  }
  var length = iterable.length || 0,
      results = new Array(length);
  while (length--) {
    results[length] = iterable[length];
  }
  return results;
};

var logErrorMessage = function (err) {
  safeLogger("callback function raised exception:");
  safeLogger("  " + err.message);
//  if ($.browser.safari) {
//    safeLogger("  sourceURL: " + err.sourceURL);
//    safeLogger("  line: " + err.line);
//  } else
  if ($.browser.mozilla) {
    safeLogger("  fileName: " + err.fileName);
    safeLogger("  lineNumber: " + err.lineNumber);
    // uncomment to get the stack
    //  safeLogger(err.stack);
  } else if ($.browser.webkit) {
    safeLogger("error stack: ");
    safeLogger(err.stack);
  }
};

var sendEvent = function (handlers) {
  var args = $A(arguments).slice(1);
  $.each(handlers, function (index, handler) {
    try {
      handler.apply(null, args);
    } catch (err) {
      logErrorMessage(err);
    }
  });
};

var eachKey = function (obj, func) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      func(key, obj[key]);
    }
  }
};

var shallowClone = function (obj) {
  var newObj = {};
  eachKey(obj, function (key, val) {
    newObj[key] = val;
  });
  return newObj;
};

// NOTE: DO NOT CALL UNTIL $(document).ready(), otherwise
// height and width will be wrong.
var dialogOptions = function (newOptions) {
  var opts = $.extend({ // defaults
    autoOpen: false,
    width: Math.min($(window).height(), 500),
    height: Math.min($(window).height(), 400),
    draggable: true,
    resizable: false,
    zIndex: 1000000 // need to cover tooltips
  }, newOptions);
  return opts;
};

