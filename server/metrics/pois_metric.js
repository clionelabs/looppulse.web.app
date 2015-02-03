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
    var poiEngine = new PoisMetricEngine([poi], current);
    var additionalInfo = {
      "interestedVisitors" : poiEngine.computeInterestedCnt(),
      "totalVisitors" : poiEngine.computeTotalVisitorsCnt()
    };

    return _.extend({}, additionalInfo, poi);

  });

  var getTop3Interested = function(pois, limit) {
    pois = _.sortBy(pois, function(poi) { return -poi.interestedVisitors; });
    var result = _.first(pois, limit);

    var totalOfTheRest = _.reduce(_.rest(pois, limit), function(memo, p) {
      return memo + p.interestedVisitors;
    }, 0);
    var otherObj = {name : "Others"};
    otherObj.interestedVisitors = totalOfTheRest;
    result.push(otherObj);

    return result;
  };

  subObj.top3Interested = getTop3Interested(subObj.pois, 3);
  return subObj;
};

PoisMetric.prototype._getCollectionName = function () {
    return "pois-metric";
};
