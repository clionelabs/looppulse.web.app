/**
 * This holds the pois metric shown on the pois list page.
 * Created by g on 30/12/14.
 */
PoisMetric = {};
PoisMetric.collection = new Meteor.Collection('pois-metric');

PoisMetric.get = function() {
    return PoisMetric.collection.findOne();
}
