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
