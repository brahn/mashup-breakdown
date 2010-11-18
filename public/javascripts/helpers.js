/*jslint indent:2, browser:true, onevar:false */
/*global $, window */

var asPercentage = function (x, numDecimals) {
  if (numDecimals === undefined) {
    numDecimals = 1;
  }
  return Math.round(100.0 * Math.pow(10, numDecimals) * x) /
    Math.pow(10, numDecimals);
};

var safeLogger = function (str) {
  if (console && console.log) {
    console.log(str);
  }
};

// swiped from prototype
var $A = function $A(iterable) {if(!iterable)return[];if('toArray'in Object(iterable))return iterable.toArray();var length=iterable.length||0,results=new Array(length);while(length--)results[length]=iterable[length];return results;};

var logErrorMessage = function (func, err) {
  safeLogger("callback function raised exception:");
  safeLogger("  " + err.message);
  if (console && console.log) {
    console.log(err);
  }
  if (BROWSER_TYPE == "safari") {
    safeLogger("  sourceURL: " + err.sourceURL);
    safeLogger("  line: " + err.line);
  } else if (BROWSER_TYPE == "firefox") {
    safeLogger("  fileName: " + err.fileName);
    safeLogger("  lineNumber: " + err.lineNumber);
    // uncomment to get the stack
    //  safeLogger(err.stack);
  } else if (BROWSER_TYPE == "chrome") {
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
      logErrorMessage(x, err);
    }
  });
};

