EngagementCreateController = RouteController.extend({

  template : "engage-create",

  onBeforeAction: AccountsTemplates.ensureSignedIn,
  waitOn : function () {
    return [
      Meteor.subscribe("getCurrentWorkspace"),
      Meteor.subscribe("getPoisMetric")
    ];
  },
  data : function () {
    return {
      "workspace" : Workspaces.findOne(),
      "poisMetric" : PoisMetric.get()

    };
  }
});