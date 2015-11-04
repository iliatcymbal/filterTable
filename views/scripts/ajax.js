utils.ajax = function (url, callback, data) {
  var xhr;
  try {
    xhr = new XMLHttpRequest('MSXML2.XMLHTTP.3.0');
    xhr.open(data ? 'POST' : 'GET', url, 1);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      var responseType, isJSON, response;

      if (xhr.readyState > 3 && callback) {
        responseType = xhr.getResponseHeader('Content-Type');
        isJSON = responseType && responseType.indexOf('json') !== -1;
        response = isJSON ? JSON.parse(xhr.responseText) : xhr.responseText;

        callback(response, xhr);
      }
    };
    xhr.send(data);
  } catch (e) {
    console.log(e);
  }
};
