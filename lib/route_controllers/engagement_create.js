EngagementCreateController = RouteController.extend({

    template : "engage-create",

    waitOn : function () {
        return [
            Meteor.subscribe("getCurrentWorkspace"),
            Meteor.subscribe("getPoisMetric")
        ];
    },
    data : function () {
        return {
            "ws" : Workspaces.findOne(),
            "pm" : PoisMetric.get()

        };
    }
});