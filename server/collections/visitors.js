/**
 *  Server extension for visitors.js
 */

/*
 * Create a visitor, if not already existed.
 * @param {Object} doc Document
 * @return {String} id
 */
Visitors.findOneOrInsert = function(doc) {
  var visitor = Visitors.findOne(doc);
  if (visitor) return visitor._id;
  return Visitors.insert(doc);
}

Meteor.startup(function() {
  Workspaces.find().observe({
    "removed": function(workspace) {
      Visitors.remove({wsId: workspace._id});
    }
  });
});
