/**
 * @property {Collection} _collection
 * @property {String[]} _fields
 */
BaseCollectionModel = function() {}

BaseCollectionModel.prototype.save = function() {
  var self = this;
  var selector = {_id: self._id};

  var fieldModifier = {};
  _.each(self.constructor._fields, function(field) {
    fieldModifier[field] = self[field];
  });

  var modifier = {
    $set: fieldModifier
  };
  var result = self.constructor._collection.upsert(selector, modifier);
  if (result.insertedId) {
    self._id = result.insertedId;
  }
  return self._id;
}

BaseCollectionModel.inheritFrom = function(child, collection, fields) {
  child.prototype = Object.create(BaseCollectionModel.prototype);
  child.prototype.constructor = child;
  child._fields = fields;
  child._collection = collection;
}
