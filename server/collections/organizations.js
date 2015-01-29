Organizations.addUserById = function (organizationId, userId) {
  return Organizations.update({_id: organizationId}, {$addToSet: {userIds: userId}});
};

Organizations.findByUserId = function (userId) {
  return Organizations.find({userIds: {$in: [userId]}});
};

_.extend(Organization.prototype, {
  'isAccessibleByUserId': function (userId) {
    var self = this;
    return _.indexOf(self.userIds, userId) != -1;
  }
});

Meteor.startup(function() {
  Meteor.users.find().observe({
    "removed": function (oldUser) {
      var oldUserId = oldUser._id;
      Organizations.update({userIds: {$in: [oldUserId]}},
                           {$pull: {userIds: oldUserId}});
    }
  })
});
