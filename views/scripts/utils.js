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
