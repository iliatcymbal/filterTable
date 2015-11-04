var fs = require('fs'),
  config = require('config'),
  file = config.get('paths.tsv');

function getArrayFromFile(inputString) {
  var regPattern = /\t/,
    infoList, titles, jsonList, index, maxCounter,
    user, length, userInfo, counter;

  infoList = inputString.split('\n');
  titles = infoList && infoList.splice(0, 1)[0].split(regPattern);

  length = infoList.length;
  maxCounter = titles.length;
  jsonList = [];

  for (index = 0, counter = 0; index < length - 1; index++) {
    user = {};
    userInfo = infoList[index].split(regPattern);
    for (counter = 0; counter < maxCounter; counter++) {
      user[titles[counter]] = userInfo[counter];
    }
    jsonList.push(user);
  }

  return {
    titles: titles,
    users: jsonList,
    length: jsonList.length
  };
}

function setFromArrayToFile(list) {
  var paths = config.get('paths'),
    names = config.get('fileNames'),
    outputFile = [paths.views, paths.prodFolder, names.usersJSON].join('/');

  fs.writeFile(outputFile, JSON.stringify(list), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log('\x1b[33m%s\x1b[0m', 'The ' + names.usersJSON + ' file was created from .tsv : ' + list.length + ' record(s)');
  });
}

fs.exists(file, function(exists) {

  if(exists) {
    fs.readFile(file, 'utf8', function (error, contents) {
      var jsonlist;

      if (contents) {
        jsonlist = getArrayFromFile(contents);

        if (jsonlist && jsonlist.length) {
          setFromArrayToFile(jsonlist);
        }

      }
    });

  } else {
    console.log('\x1b[31m%s\x1b[0m', file, 'file doesn\'t exist')
  }
});
