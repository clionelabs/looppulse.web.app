Meteor.methods({
  /*
   * organizationData: `name`
   * userData: `email`, optional `password`
   */
  createOrganizationAndUser: function (organizationData, userData) {
    var organizationId = Organizations.insert(organizationData);
    var userId = Accounts.createUser(userData);

    var res = Organizations.addUserById(organizationId, userId);
    return Meteor.users.addOrganizationById(userId, organizationId);
  }
})
