/**
 * This holds the pois metric shown on the pois list page.
 */
PoisMetric = {};
PoisMetric.collection = new Meteor.Collection('pois-metric');

PoisMetric.get = function() {
  return PoisMetric.collection.findOne();
};

