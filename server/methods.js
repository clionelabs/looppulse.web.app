Meteor.methods({
  /**
   * Don't bother to name / separate them, just a temp solution
   * @param workspaceData { name : "workspaceName", { one : "poiDescSingularForm", many : "poiDescPluralForm" }}
   * @param organizationData { name : "<organization name>" }
   * @param userData { email : "<email>", password : "<password>" }
   * @returns {String} userId
   */
  createWorkspaceAndOrganizationAndUser: function (workspaceData, organizationData, userData) {
    var organizationId = Organizations.insert(organizationData);
    workspaceData = _.extend({}, {organizationId : organizationId}, workspaceData);
    var workspaceId = Workspaces.insert(workspaceData);
    var userId = Accounts.createUser(userData);
    Accounts.sendVerificationEmail(userId);

    Organizations.addUserById(organizationId, userId);
    return userId;
  }
})
