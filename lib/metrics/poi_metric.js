/**
 * This holds the pois metric shown on the pois list page.
 */
PoiMetric = {};
PoiMetric.collection = new Meteor.Collection('poi-metric');

PoiMetric.get = function() {
  return PoiMetric.collection.findOne();
}
