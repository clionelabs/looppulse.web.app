Meteor.methods({
  /*
   * organizationData: `name`
   * userData: `email`, optional `password`
   */
  createOrganizationAndUser: function (organizationData, userData) {
    var organizationId = Organizations.insert(organizationData);
    var userId = Accounts.createUser(userData);

    return Organizations.addUserById(organizationId, userId);
  }
})
