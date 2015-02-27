EngagementCreateController = RouteController.extend({

  template : "engage-create",

  onBeforeAction: AccountsTemplates.ensureSignedIn,
  waitOn : function () {
    return [
      Meteor.subscribe("currentWorkspaceAndOrganization"),
      Meteor.subscribe("poisMetric", this.params.workspaceId)
    ];
  },
  data : function () {
    return {
      "workspace" : Workspaces.findOne(),
      "poisMetric" : PoisMetric.get()

    };
  },
  action: function() {
    console.log("action: ", this.params.poiId);
    this.state.set('selectedPoiId', this.params.poiId);
    this.render();
  }
});