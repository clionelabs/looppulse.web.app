/**
 * This related to lib/metrics/pois_metric.js
 */

/**
 * @property {Poi[]} pois
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

PoisMetric.prototype._createAggregate = function () {
  var self = this;
  self.pois = Pois.find().fetch();
  var current = moment();
  var engine = new PoisMetricEngine(self.pois, current);

  var subObj = {};
  subObj.activity = "active";
  subObj.count = self.pois.length;
  subObj.totalVisitors = engine.computeTotalVisitorsCnt();
  subObj.totalCurrentVisitors = engine.computeCurrentVisitorsCnt();
  var aWeekAgo = moment(current).subtract(7, 'days').startOf('day');
  subObj.max7daysVisitors = engine.computePeakVisitorsCnt(aWeekAgo, current);
  var startOfToday = moment(current).startOf('day');
  subObj.maxDailyVisitors = engine.computePeakVisitorsCnt(startOfToday, current);
  subObj.interestedVisitors = engine.computeInterestedCnt();
  subObj.averageDwellTime = engine.computeAvgDwellTime();

  subObj.pois = _.map(self.pois, function (poi) {
    var additionalInfo = {
      "interestedVisitors" : engine.computeInterestedCnt([poi._id]),
      "totalVisitors" : engine.computeTotalVisitorsCnt([poi._id])
    };
    return _.extend({}, additionalInfo, poi);
  });

  var sortedPois = _.sortBy(subObj.pois, function(poi) {
    return -poi.interestedVisitors;
  });
  var topInterestedPois = _.first(sortedPois, self.topInterestsLimit);
  var restPoiIds = _.pluck(_.rest(sortedPois, self.topInterestsLimit), '_id');

  var topInterested = _.reduce(topInterestedPois, function(memo, poi) {
    memo.push({name: poi.name, interestedVisitors: poi.interestedVisitors});
    return memo;
  }, []);
  if (restPoiIds.length > 0) {
    topInterested.push({name: "Others", interestedVisitors: engine.computeTotalVisitorsCnt(restPoiIds)});
  }
  subObj.topInterested = topInterested;
  return subObj;
};

PoisMetric.prototype._getCollectionName = function () {
    return "pois-metric";
};
