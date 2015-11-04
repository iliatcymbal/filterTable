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
