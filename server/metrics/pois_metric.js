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
    var subObj = {};
    //TODO impl
    subObj.activity = "active";
    subObj.count = self.pois.length;
    //TODO impl
    subObj.totalVisitors = 12345;
    //TODO impl
    subObj.interestedVisitors = 3268;
    //TODO impl
    subObj.averageDwellTime = 60 * 1000 * 36 + 42 * 1000; //36:42
    //TODO impl to use poimetric
    subObj.pois = self.pois;
    return subObj;

};

PoisMetric.prototype._getCollectionName = function () {
    return "pois-metric";
};
