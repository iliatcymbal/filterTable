window.utils = (function () {
  var storage = {};

  function getCollectionByString(collection, string, fields, isLastItem) {
    var results = [],
      keyMatch, keys;

    traverseCollection(collection, function (item) {
      var sample = item.item || item;
      keyMatch = isObjectHasString(sample, string, fields, isLastItem);

      if (keyMatch) {
        keys = item.keys || [];
        keys.push(keyMatch);

        results.push({
          item: sample,
          keys: keys
        });
      }
    });

    return results.length && results;
  }

  function isObjectHasString(collection, pattern, fields, isLastItem) {
    return traverseCollection(collection, function (value, key) {
      if (fields && utils.indexOf(fields, key) === -1) {
        return;
      }

      var search = new RegExp('^' + pattern),
        isMatched = isLastItem ? search.test(value) : value === pattern;

      return isMatched && key;
    });
  }

  function traverseCollection(collection, callBack) {
    var length = collection.length,
      isArray = collection instanceof Array,
      result,
      index = 0, key;

    if (isArray) {
      for (; index < length; index++) {
        result = callBack(collection[index], index);
        if (result) {
          return result;
        }
      }
    } else {
      for (key in collection) {
        result = callBack(collection[key], key);
        if (result) {
          return result;
        }
      }
    }
  }

  return {
    getFromStorage: function (id) {
      return storage[id];
    },

    setToStorage: function (id, data) {
      if (id) {
        storage[id] = data;
      } else {
        throw 'Id should be defined!';
      }

      return storage[id];
    },

    indexOf: function (collection, pattern) {
      var index = collection && collection.length;

      while (index--) {
        if (collection[index] === pattern) {
          return index;
        }
      }

      return -1;
    },

    getItemsByPattern: function (o) {
      var collection = o.collection,
        pattern = o.pattern,
        fields = o.fields,
        getCollection = function (collection, string, isLastItem) {
          return getCollectionByString(collection, string, fields, isLastItem);
        },
        foundList;

      traverseCollection(pattern, function (string, counter) {
        var isLastItem = o.single || (counter === pattern.length - 1);
        if (!counter) {
          foundList = getCollection(collection, string, isLastItem);
        } else if (foundList) {
          foundList = getCollection(foundList, string, isLastItem);
        }
      });


      return foundList;
    },

    getUniqueItems: function (collection) {
      var result = [],
        helper = {};

      traverseCollection(collection, function (item) {
        var value = item.item[item.keys];

        if (helper[value]) {
          helper[value].items.push(item.item);
        } else {
          helper[value] = {
            items: [item.item],
            text: value,
            toString: function () {
              return this.text;
            }
          };
          result.push(helper[value]);
        }
      });

      return result;
    },

    clearValues: function (domCollection) {
      var index = domCollection.length;
      while (index--) {
        domCollection[index].value = '';
      }
    }
  };
}());

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

utils.DOMReady = function (callback) {
  var event = 'addEventListener';

  if (document[event]) {
    document[event]('DOMContentLoaded', callback);
  } else {
    window.attachEvent('onload', callback);
  }
};

utils.createDropdown = (function () {
  var template = '<input type="text" placeholder="Type value here"><ul></ul>';

  function Create(id, field) {
    var self = this;

    this.element = document.getElementById(id);
    this.field = field;

    this.element.innerHTML = template;
    this.list = this.element.querySelector('ul');
    this.textField = this.element.querySelector('input');

    utils.addEvent(this.textField, 'keyup', function (e) {
      var target = e.target || e.srcElement;

      self.value = target.value;

      if (self.value) {
        textFieldHandler.call(self);
      } else {
        self.list.style.display = 'none';
      }
    });
  }

  Create.prototype.setCollection = function (collection) {
    this.collection = collection;
    return this;
  };

  Create.prototype.onSelect = function (handler) {
    var self = this;
    utils.addEvent(this.list, 'click', function (e) {
      var target = e.target || e.srcElement,
        index, selected;

      if (target.tagName === 'LI') {
        index = utils.indexOf(target.parentElement.children, target);
        selected = self.uniqueItems[index];

        handler(selected);

        self.textField.value = selected;
        self.list.style.display = 'none';
      }
    });

    return this;
  };

  function textFieldHandler() {
    var filtered = utils.filter(this.collection, this.value, this.field, true);
      this.uniqueItems = utils.getUniqueItems(filtered);

    if (this.uniqueItems.length) {
      this.list.innerHTML = '<li>' + this.uniqueItems.join('</li><li>') + '</li>';
      this.list.style.display = 'block';
    } else {
      this.list.style.display = 'none';
    }
  }

  return Create;
}());

utils.filter = function (collection, query, fields, single) {
  var options = {
      collection: collection,
      fields: fields instanceof Array ? fields : [fields]
    },
    results;

  if (!single) {
    options.pattern = query && query.split(/\s+/);
  } else {
    options.pattern = [query];
    options.single = true;
  }


  results = utils.getItemsByPattern(options);

  return results;
};

utils.DOMReady(function () {
  var englishResult = document.querySelector('.english-result em'),
    filterField = document.getElementById('filter'),
    loader = document.querySelector('.ajax-loader'),
    elements, value, results;

  function updateTable(value) {
    var users = utils.getFromStorage('users'),
      fields = ['firstname', 'lastname', 'email'],
      filtered;

    if (!value.length) {
      utils.table.updateTable(results);
    } else {
      if (value.substr(0, 1) === '#') {
        value = value.substr(1);
        fields.push('uid');
      }

      filtered = utils.filter(users, value, fields);
      utils.table.updateTable(results, filtered);
    }
  }

  utils.addEvent(englishResult, 'click', function () {
    updateTable(value);
    filterField.value = value;
    englishResult.parentElement.style.visibility = 'hidden';
  });

  utils.addEvent(filterField, 'keyup', function (e) {
    var target = e.target || e.srcElement,
      processedValue;

    value = target.value;

    if (value.length === 1) {
      return;
    }

    processedValue = utils.getMappedValue(value);

    updateTable(value);

    if (!processedValue.isEnglish) {
      value = processedValue.text;
      englishResult.parentElement.style.visibility = 'visible';
      englishResult.innerHTML = value;
    }

    if (!value.length) {
      englishResult.parentElement.style.visibility = 'hidden';
    }

    elements = elements || document.querySelectorAll('.dropdown input');
    utils.clearValues(elements);
  });

  loader.style.display = 'block';

  utils.ajax('src/users.json', function (text) {
    var users = utils.table.createTable(text.titles, text.users);

    results = utils.table.createTable(text.titles);

    utils.setToStorage('users', text.users);

    utils.getFromStorage('jobDrop').setCollection(text.users);
    utils.getFromStorage('countryDrop').setCollection(text.users);

    document.querySelector('.table-holder').appendChild(users);
    document.querySelector('.results').appendChild(results);

    loader.style.display = 'none';
  });
});

utils.DOMReady(function () {
  var jobDrop = new utils.createDropdown('job', 'job'),
    countryDrop = new utils.createDropdown('country', 'country'),
    table, elements;

  utils
    .setToStorage('jobDrop', jobDrop)
    .onSelect(selectHandler);

  utils
    .setToStorage('countryDrop', countryDrop)
    .onSelect(selectHandler);

  function selectHandler(selected) {
    elements = elements || document.querySelectorAll('#filter, .dropdown input');
    table = table || document.querySelector('.results table');

    utils.clearValues(elements);

    utils.table.updateTable(table, selected.items);
  }
});

utils.getMappedValue = (function () {
  var cyrillicChars = '[ёґ]йцукенгшщзх[ъї]ф[ыі]вапролдж[эє]ячсмитьбю[ЁҐ]ЙЦУКЕНГШЩЗХ[ЪЇ]ФЫВАПРОЛДЖ[ЭЄ]ЯЧСМИТЬБЮ"',
    latinChars = "`qwertyuiop[]asdfghjkl;'zxcvbnm,.~QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>@",
    engPattern = new RegExp('^[a-z !@#$%&*-_]+$', 'i'),
    mapObject = (function () {
      var map = {},
        indexEng = latinChars.length,
        indexCyr = cyrillicChars.length,
        currentCyrChar;

      while (indexEng--) {
        indexCyr--;

        currentCyrChar = cyrillicChars[indexCyr];

        if (currentCyrChar === ']') {
          indexCyr--;
          currentCyrChar = cyrillicChars[indexCyr];

          while (currentCyrChar !== '[') {
            map[currentCyrChar] = latinChars[indexEng];

            indexCyr--;
            currentCyrChar = cyrillicChars[indexCyr];

            if (!indexCyr) {
              break;
            }
          }
        } else if (currentCyrChar !== '[') {
          map[currentCyrChar] = latinChars[indexEng];
        }
      }

      return map;
    }());


  function getMappedValue(string) {
    var newValue = '',
      index = 0, max = string.length,
      isEnglish = true,
      char;

    if (!engPattern.test(string)) {
      for (; index < max; index++) {
        char = string[index];
        if (engPattern.test(char)) {
          newValue += char;
        } else {
          newValue += mapObject[char] || char;
          isEnglish = false;
        }
      }
    }

    return {
      text: newValue || string,
      isEnglish: isEnglish
    };
  }

  return getMappedValue;

}());

utils.addEvent = function (elem, type, handler){
  if (elem.addEventListener){
    elem.addEventListener(type, handler, false);
  } else {
    elem.attachEvent("on"+type, handler);
  }
};

utils.table = (function () {
  var titles;

  function createTable(columns, rows) {
    var table = document.createElement('table'),
      firstRow = table.insertRow(0),
      th, index = 0, max = columns.length;

    titles = columns;

    for (; index < max; index++) {
      th = document.createElement('th');
      th.innerHTML = columns[index];
      firstRow.appendChild(th);
    }

    appendRows(table, rows, columns);

    return table;
  }

  function appendRows(table, rows) {
    var length = rows && rows.length,
      index = 0;

    for (; index < length; index++) {
      fillRow(table.insertRow(index + 1), rows[index], titles);
    }
  }

  function fillRow(row, cells) {
    var index = 0,
      length = titles.length,
      markKeys = cells.keys,
      cell;

    cells = cells.item ? cells.item : cells;

    for (; index < length; index++) {
      cell = row.insertCell(index);
      cell.innerHTML = cells[titles[index]];

      if (utils.indexOf(markKeys, titles[index]) !== -1) {
        cell.className += ' mark';
      }
    }
  }

  function deleteRows(table) {
    var rows = table.getElementsByTagName('TR'),
      index = rows.length;

    while (--index) {
      table.deleteRow(index);
    }
  }

  function updateTable(table, rows) {
    deleteRows(table);

    if (rows) {
      appendRows(table, rows);
    }
  }

  return {
    createTable: createTable,
    updateTable: updateTable
  };

}());
