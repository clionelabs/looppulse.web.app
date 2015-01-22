Organizations.addUserById = function (organizationId, userId) {
  Organizations.update({_id: organizationId}, {$addToSet: {userIds: userId}});
};

Organizations.findByUserId = function (userId) {
  Organizations.find({userIds: {$in: [userId]}});
}
