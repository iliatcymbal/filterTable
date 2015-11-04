utils.DOMReady = function (callback) {
  var event = 'addEventListener';

  if (document[event]) {
    document[event]('DOMContentLoaded', callback);
  } else {
    window.attachEvent('onload', callback);
  }
};
