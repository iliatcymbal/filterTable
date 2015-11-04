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
