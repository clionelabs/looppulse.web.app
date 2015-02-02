PoisController = RouteController.extend({
    template : "pois",
    onBeforeAction: AccountsTemplates.ensureSignedIn,
    waitOn : function () {

        return [
            Meteor.subscribe("getPoisMetric", "Demo"),
            Meteor.subscribe("getCurrentWorkspace")
        ];
    },
    data : function () {
        return { "ws" : Workspaces.findOne(),
                 "pm" : PoisMetric.get()

        };
    }

});
