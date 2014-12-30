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
    subObj.count = self.pois.length;
    //TODO impl
    subObj.totalVisitors = 0;
    //TODO impl
    subObj.interestedVisitors = 0;
    //TODO impl
    subObj.averageDwellTime = 0;
    //TODO impl
    subObj.newVisits = 0;
    //TODO impl
    subObj.pois = self.pois;
    return subObj;

};

PoisMetric.prototype._getCollectionName = function () {
    return "pois-metric";
};
