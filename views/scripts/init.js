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
