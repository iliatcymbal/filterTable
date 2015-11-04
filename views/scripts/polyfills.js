utils.addEvent = function (elem, type, handler){
  if (elem.addEventListener){
    elem.addEventListener(type, handler, false);
  } else {
    elem.attachEvent("on"+type, handler);
  }
};
