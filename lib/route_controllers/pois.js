var subs = new SubsManager();

PoisController = RouteController.extend({
  template : "pois",
  onBeforeAction: AccountsTemplates.ensureSignedIn,
  waitOn : function () {
    return [
      subs.subscribe("getCurrentWorkspace"),
      subs.subscribe("getPois"),
      subs.subscribe("getPoisMetric")
    ];
  },
  data : function () {
    if (this.ready()) {
      return {
        "workspace": Workspaces.findOne(),
        "poisMetric": PoisMetric.get()

      };
    }
  }
});
