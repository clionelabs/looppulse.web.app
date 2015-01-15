/**
 *
 * Created by g on 29/12/14.
 */
EngagementCreateController = RouteController.extend({

    template : "engage-create",

    waitOn : function () {
        return [
            Meteor.subscribe("getCurrentWorkspace")
        ];
    },
    data : function () {
        return {
            "ws" : Workspaces.findOne(),
        };
    }
});