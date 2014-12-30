/**
 *
 * Created by g on 29/12/14.
 */
PoisController = RouteController.extend({
    template : "pois",
    waitOn : function () {

        return [
            Meteor.subscribe("getPoisMetric", "Demo")
        ];
    },
    data : function () {
        return PoisMetric.get();
    }
});
