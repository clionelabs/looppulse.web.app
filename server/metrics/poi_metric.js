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

  self = self._createAggregate();

  sub.added(self.name, self.name, self);

  var handler = Meteor.setInterval(function() {
    self = self._createAggregate();
    sub.changed(self.name, self.name, self);

  }, self.interval);

  sub.onStop(function() {
    Meteor.clearInterval(handler);
  });

};

PoiMetric.prototype._createAggregate = function () {
  var self = this;
  self.poi = Pois.findOne({_id : self.poiId });
  var current = moment();
  var engine = new PoisMetricEngine([self.poi], current);

  self.id = self.poi._id;
  //TODO impl
  self.activity = "active";
  self.totalVisitors = engine.computeTotalVisitorsCnt();
  self.totalCurrentVisitors = engine.computeCurrentVisitorsCnt();
  var aWeekAgo = moment(current).subtract(7, 'days').startOf('day');
  self.max7daysVisitors = engine.computePeakVisitorsCnt(aWeekAgo, current);
  var startOfToday = moment(current).startOf('day');
  self.maxDailyVisitors = engine.computePeakVisitorsCnt(startOfToday, current);
  self.interestedVisitors = engine.computeInterestedCnt();
  self.averageDwellTime = engine.computeAvgDwellTime();

  //TODO impl common interested

  self.gaugeData = self._toGauge();

  return self;
};

PoiMetric.prototype._getCollectionName = function () {
  return "poi-metric";
};

PoiMetric.prototype._toGauge = function() {
  var self = this;
  return {
    current: {
      "total": self.totalCurrentVisitors,
      "title": "CURRENT",
      "arm" : self.maxDailyVisitors / self.max7daysVisitors, //TODO display logic
      "subContent": self.max7daysVisitors,
      "subTitle": "max of last 7 days",
      //array because need to cater "related top 3" in detail view
      percentage: [self.totalCurrentVisitors / self.max7daysVisitors]
    },
    interested: {
      "total": self.interestedVisitors,
      "title": "INTERESTED",
      "subContent": self.totalVisitors,
      "subTitle": "total unique",
      percentage: self._constructInterestedList()
    }
  };
};

PoiMetric.prototype._constructInterestedList = function() {
  //TODO impl
  return [];
}
