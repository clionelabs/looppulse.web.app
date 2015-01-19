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
    var engine = new PoisMetricEngine(self.pois, moment());

    var subObj = {};
    subObj.activity = "active";
    subObj.count = self.pois.length;
    subObj.totalVisitors = engine.computeTotalVisitorsCnt();
    subObj.interestedVisitors = engine.computeInterestedCnt();
    subObj.averageDwellTime = engine.computeAvgDwellTime();
    subObj.pois = self.pois;
    return subObj;
};

PoisMetric.prototype._getCollectionName = function () {
    return "pois-metric";
};
