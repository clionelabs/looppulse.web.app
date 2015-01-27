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

_.extend(Organization.prototype, {
  'isAccessibleByUserId': function (userId) {
    var self = this;
    return _.indexOf(self.userIds, userId) != -1;
  }
});
