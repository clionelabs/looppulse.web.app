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

Organizations.findById = function(organizationId, userId, options){
  if (!userId) {
    userId = ""
  }

  if (!organizationId) {
    organizationId = ""
  }

  return Organizations.find({ _id: organizationId, userIds: {$in: [userId]} }, options);
}

Organization = function(doc) {
  _.extend(this, doc);
};
