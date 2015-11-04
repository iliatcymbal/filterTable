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
