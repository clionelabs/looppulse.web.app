/**
 * Visitor is a unique combination of workspace and device UUID
 */
Visitors = new Meteor.Collection('visitors', {
  transform: function(doc) {
    return new Visitor(doc);
  }
});

/**
 *
 * Class constructor
 * @property {String} wsId {@link Workspace}
 * @property {String} uuid Unique identifier per device (expecting Advertising ID)
 * @property {String} externalId Custom id for client's application (e.g. userId in their own membership system)
 */
Visitor = function(doc) {
  _.extend(this, doc);
};

Visitor.prototype.save = function() {
  var self = this;
  var selector = {_id: self._id};
  var modifier = {
    $set: {
      wsId: self.wsId,
      uuid: self.uuid,
      externalId: self.externalId
    }
  }
  var result = Visitors.upsert(selector, modifier);
  if (result.insertedId) {
    self._id = result.insertedId;
  }
  return self._id;
};
