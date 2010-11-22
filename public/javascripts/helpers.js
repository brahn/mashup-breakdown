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

var safeLogger = function (str) {
  if (window.console && window.console.log) {
    window.console.log(str);
  }
};

// swiped from prototype
var $A = function $A(iterable) {if(!iterable)return[];if('toArray'in Object(iterable))return iterable.toArray();var length=iterable.length||0,results=new Array(length);while(length--)results[length]=iterable[length];return results;};

var logErrorMessage = function (err) {
  safeLogger("callback function raised exception:");
  safeLogger("  " + err.message);
  if (console && console.log) {
    console.log(err);
  }
  if ($.browser.safari) {
    safeLogger("  sourceURL: " + err.sourceURL);
    safeLogger("  line: " + err.line);
  } else if ($.browser.mozilla) {
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
  $(handlers).each(function (index, handler) {
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
  newOptions = newOptions || {};
  var opts = { // defaults
    autoOpen: false,
    width: Math.min($('#samples').width(), 500),
    height: Math.min($('#samples').height(), 400),
    draggable: true,
    resizable: false,
    zIndex: 1000000 // need to cover tooltips
  };
  eachKey(newOptions, function (key, val) {
    opts[key] = val;
  });
  return opts;
};