/**
 * Organization
 * Holder of a workspace and user
 *
 * Document property
 * @property {String} name Organization name
 */
Organizations = new Meteor.Collection('organizations', {
  transform: function(doc) {
    return new Organization(doc);
  }
});

Organization = function(doc) {
  _.extend(this, doc);
};

Organizations.findByUserId = function (userId) {
  return Organizations.find({userIds: {$in: [userId]}});
};
