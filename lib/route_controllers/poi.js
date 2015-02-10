var subs = new SubsManager();

PoiController = RouteController.extend({
  template : "poi",
  onBeforeAction: AccountsTemplates.ensureSignedIn,
  waitOn : function () {
    return [
      subs.subscribe("currentWorkspaceAndOrganization"),
      Meteor.subscribe("poiMetric", this.params.id)
    ]
  },
  data : function() {
    if (this.ready()) {
      return {
        "workspace": Workspaces.findOne(this.params.workspaceId),
        "poiMetric": PoiMetric.get()
      }
    }
  }
});
