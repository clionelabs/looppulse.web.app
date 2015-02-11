var subs = new SubsManager();

HomeController = RouteController.extend({
  template: 'home',
  waitOn : function() {
    return [subs.subscribe("currentWorkspaceAndOrganization")];
  },
  action : function() {
    if (Meteor.user()) {
      var organization = Organizations.findByUserId(Meteor.userId()).fetch()[0];
      var workspaceId = Workspaces.findOne({ organizationId : organization._id })._id;
      Router.go("/workspace" + "/" + workspaceId + "/pois");
    } else {
      this.render();
    };
  }
});
