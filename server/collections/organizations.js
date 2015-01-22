Organizations.addUserById = function (organizationId, userId) {
  Organizations.update({_id: organizationId}, {$addToSet: {userIds: userId}});
};
