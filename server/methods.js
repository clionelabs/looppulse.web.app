Meteor.methods({
  /**
   * @param jsonURL Online JSON file containing organizations to create
   */
   importOrganizationsFromUrl: function (jsonURL) {
     JSON.importOrganizationsFromUrl(jsonURL);
   },

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
  },

  /**
   *
   * @param applicationData { name : "applicationName", workspaceId : "workspaceId", token : "r\@nD0m" }
   * @returns {String} newly created application {@link Applications}
   */
  addApplication: function(applicationData) {
    if (!Workspaces.findOne(applicationData.workspaceId)) {
      throw Meteor.Error("Workspace not found");
    } else {
      //in case you dont want to specify token
      applicationData = _.extend({}, applicationData, { token : Random.id()});
      var id = Applications.insert(applicationData);
      var result = _.extend({}, { _id : id }, applicationData);
      console.log("Result application" + JSON.stringify(result));
      return result;
    }
  },

  /**
   *
   * @param poiData { workspaceId : "relatedWorkspaceId",
   *                  name : "name",
   *                  beacon : { uuid : "UUID", major : "major", minor : "minor" }
   *                }
   */
  addPoi: function(poiData) {
    if (!Workspaces.findOne(poiData.workspaceId)) {
      throw Meteor.Error("Workspace not found");
    } else {
      var id = Pois.insert(poiData);
      var result = _.extend({}, { _id : id }, poiData);
      console.log("Result POI" + JSON.stringify(result));
      return result;
    }
  }
});
