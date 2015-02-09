/**
 * This related to lib/metrics/poi_metric.js
 */

/**
 * @property {String} poiId
 * @param doc
 * @constructor
 */
PoiMetric = function (doc) {
  _.extend(this, doc);
  this.name = "poi-metric";
  this.interval = 1000 * 10;
};

PoiMetric.prototype._publishCursor = function (sub) {
  var self = this;

  var subObj = self._createAggregate();

  sub.added(self.name, self.name, subObj);

  var handler = Meteor.setInterval(function() {
    var subObj = self._createAggregate();
    sub.changed(self.name, self.name, subObj);

  }, self.interval);

  sub.onStop(function() {
    Meteor.clearInterval(handler);
  });

};

PoiMetric.prototype._createAggregate = function () {
  var self = this;
  self.poi = Pois.find({_id : self.poiId }).fetch()[0];
  var current = moment();
  var engine = new PoisMetricEngine([self.poi], current);

  var subObj = {};
  subObj.id = self.poi._id;
  subObj.name = self.poi.name;
  //TODO impl
  subObj.activity = "active";
  subObj.totalVisitors = engine.computeTotalVisitorsCnt();
  subObj.totalCurrentVisitors = engine.computeCurrentVisitorsCnt();
  var aWeekAgo = moment(current).subtract(7, 'days').startOf('day');
  subObj.max7daysVisitors = engine.computePeakVisitorsCnt(aWeekAgo, current);
  var startOfToday = moment(current).startOf('day');
  subObj.maxDailyVisitors = engine.computePeakVisitorsCnt(startOfToday, current);
  subObj.interestedVisitors = engine.computeInterestedCnt();
  subObj.averageDwellTime = engine.computeAvgDwellTime();

  return subObj;
};

PoiMetric.prototype._getCollectionName = function () {
  return "poi-metric";
};
