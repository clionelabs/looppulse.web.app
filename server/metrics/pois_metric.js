/**
 * This related to lib/metrics/pois_metric.js
 */


/**
 * @property {workspaceId} workspace
 * @property {Object} name
 * @param doc
 * @constructor
 */
PoisMetric = function (doc) {
  _.extend(this, doc);
  this.name = "pois-metric";
  this.interval = 1000 * 10;
  this.topInterestsLimit = 3;
};

PoisMetric.prototype._publishCursor = function (sub) {

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

PoisMetric.prototype._createAggregate = function () {
  var self = this;
  self.pois = Pois.find({ "workspaceId" : self.workspaceId }).fetch();
  var current = moment();
  var engine = new PoisMetricEngine(self.pois, current);

  //TODO impl
  self.activity = "active";
  self.count = self.pois.length;
  self.totalVisitors = engine.computeTotalVisitorsCnt();
  self.totalCurrentVisitors = engine.computeCurrentVisitorsCnt();
  var aWeekAgo = moment(current).subtract(7, 'days').startOf('day');
  self.max7daysVisitors = engine.computePeakVisitorsCnt(aWeekAgo, current);
  var startOfToday = moment(current).startOf('day');
  self.maxDailyVisitors = engine.computePeakVisitorsCnt(startOfToday, current);
  self.interestedVisitors = engine.computeInterestedCnt();
  self.averageDwellTime = engine.computeAvgDwellTime();

  self.pois = _.map(self.pois, function (poi) {
    var additionalInfo = {
      "interestedVisitors" : engine.computeInterestedCnt([poi._id]),
      "totalVisitors" : engine.computeTotalVisitorsCnt([poi._id])
    };
    return _.extend({}, additionalInfo, poi);
  });

  var sortedPois = _.sortBy(self.pois, function(poi) {
    return -poi.interestedVisitors;
  });
  var topInterestedPois = _.first(sortedPois, self.topInterestsLimit);
  var restPoiIds = _.pluck(_.rest(sortedPois, self.topInterestsLimit), '_id');

  var topInterested = _.reduce(topInterestedPois, function(memo, poi) {
    memo.push({name: poi.name, interestedVisitors: poi.interestedVisitors});
    return memo;
  }, []);
  if (restPoiIds.length > 0) {
    topInterested.push({name: "Others", interestedVisitors: engine.computeInterestedCnt(restPoiIds)});
  }
  self.topInterested = topInterested;

  self.gaugeData = self._toGauge();
  return self;
};

PoisMetric.prototype._getCollectionName = function () {
  return "pois-metric";
};

PoisMetric.prototype._toGauge = function() {
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

PoisMetric.prototype._constructInterestedList = function() {
  var self = this;
  return _.map(self.topInterested, function(r) {
    return r.interestedVisitors / self.totalVisitors;
  });
}
