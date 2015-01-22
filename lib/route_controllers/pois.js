PoisController = RouteController.extend({
    template : "pois",
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
