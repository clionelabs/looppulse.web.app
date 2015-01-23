Meteor.methods({
  /*
   * organizationData: `name`
   * userData: `email`, optional `password`
   */
  createOrganizationAndUser: function (organizationData, userData) {
    if (_.isEmpty(organizationData) || _.isEmpty(userData))
      throw new Meteor.Error(402, "Missing Parameter")

    var organizationId = Organizations.create(organizationData);
    var userId = Accounts.createUser(userData);

    var res = Organizations.addUserById(organizationId, userId);

    return { result: "success", userId: userId, organizationId: organizationId }
  },
  inviteOrganizationUser: function (organizationId, userEmail) {
    if (!this.userId)
      throw new Meteor.Error(401, "You need to login")

    if (_.isEmpty(organizationId) || _.isEmpty(userEmail))
      throw new Meteor.Error(402, "Missing Parameter")

    if (Organizations.findById(organizationId, this.userId).count <= 0)
      throw new Meteor.Error(403, "Organizations not exist or You don't have access")

    var userId = Accounts.createUser({email:userEmail});

    var res = Organizations.addUserById(organizationId, userId);

    return { result: "success", userId: userId, organizationId: organizationId }
  }
})
