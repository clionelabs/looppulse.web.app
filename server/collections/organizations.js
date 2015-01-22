Organizations.addUserById = function (organizationId, userId) {
  return Organizations.update({_id: organizationId}, {$addToSet: {userIds: userId}});
};
Organizations.findByUserId = function (userId) {
  return Organizations.find({userIds: {$in: [userId]}});
}