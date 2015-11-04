/**
 * Created by Ilya on 12.10.2015.
 */

var http = require('http'),
  fileServer = require('./fileServer'),
  config = require('config'),
  serverConfig = config.get('server.port'),
  paths = config.get('paths'),
  names = config.get('fileNames');

http.createServer(function (request, response) {
  var file = [__dirname, paths.views, request.url].join('/');

  if (request.url === '/') {
    file = [__dirname, paths.views, names.mainHTML].join('/');
  }

  fileServer(file, request, response);

}).listen(serverConfig);

console.log('\x1b[33m%s\x1b[0m', 'Server running at http://127.0.0.1:' + serverConfig);
