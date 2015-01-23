// Server side only operation

// Security
// Since user won't have userIds in client side most of the time,
// so the client side security will be:
//    "what you have is what you can access"
// and the server side security will be query based on Id
Organizations.addUserById = function (organizationId, userId) {
  return Organizations.update({_id: organizationId}, {$addToSet: {userIds: userId}});
};

// Wrapped find method require userid
Organizations.findByUserId = function (userId, options) {
  if (!userId) {
    userId = ""
  }

  return Organizations.find({ userIds: {$in: [userId]} }, options);
};

Organizations.findById = function(organizationId, userId, options){
  if (!userId) {
    userId = ""
  }

  if (!organizationId) {
    organizationId = ""
  }

  return Organizations.find({ _id: organizationId, userIds: {$in: [userId]} }, options);
}

Meteor.startup(function() {
  Meteor.users.find().observe({
    "removed": function (oldUser) {
      var oldUserId = oldUser._id;
      Organizations.update({userIds: {$in: [oldUserId]}},
                           {$pull: {userIds: oldUserId}});
    }
  })
});
