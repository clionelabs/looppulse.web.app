var subs = new SubsManager();

PoisController = RouteController.extend({
  template : "pois",
  onBeforeAction: AccountsTemplates.ensureSignedIn,
  waitOn : function () {
    return [
      subs.subscribe("currentWorkspaceAndOrganization"),
      Meteor.subscribe("poisMetric", this.params.workspaceId)
    ];
  },
  data : function () {
    if (this.ready()) {
      return {
        "workspace": Workspaces.findOne(this.params.workspaceId),
        "poisMetric": PoisMetric.get()

      };
    }
  },
  action: function() {
    this.state.set('workspaceId', this.params.workspaceId);
    this.render();
  }
});
