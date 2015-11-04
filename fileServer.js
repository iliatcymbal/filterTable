module.exports = function(file, req, res) {
  var fs = require('fs'),
    ext = require('path').extname(file).replace('.', ''),
    type = '',
    fileExtensions = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'json': 'application/json',
      'ico': 'image/x-icon'
    };

  type = fileExtensions[ext];

  fs.exists(file, function(exists) {
    if(exists) {
      res.writeHead(200, { 'Content-Type': type });
      fs.createReadStream(file).pipe(res);

      console.log('sent  ' + req.url, 'file ---  ', file);

    } else {
      res.writeHead(404);
      res.end('Unable get ' + req.url);
      console.log(file, ' file doesn\'t exist')
    }
  })
};
