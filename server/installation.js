Installation = {
  /*
   * organizationData: `name`
   * userData: `email`, optional `password`
   */
  createOrganizationAndUser: function (organizationData, userData) {
    organizationId = Organizations.insert(organizationData);
    userId = Accounts.createUser(userData);

    Organizations.addUserById(organizationId, userId);
  }
}
