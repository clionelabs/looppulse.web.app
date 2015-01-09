/**
 * Visitor is a unique combination of workspace and device UUID
 *
 * Document property
 * @property {String} wsId {@link Workspace}
 * @property {String} uuid Unique identifier per device (expecting Advertising ID)
 * @property {String} externalId Custom id for client's application (e.g. userId in their own membership system)
 */
Visitors = new Meteor.Collection('visitors', {
  transform: function(doc) {
    return new Visitor(doc);
  }
});

Visitor = function(doc) {
  _.extend(this, doc);
};
