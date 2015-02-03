/**
 * This class handle metric computation of a list of pois
 * Note: When calculating the duration of non-closed encounter (i.e. time difference from enteredAt to current), we need to use the current time.
 *       Instead of using the dynamically changing system time (e.g. Date.now()), we pass in an explicit "current" time to make the computation more deterministic.
 *       This is also to avoid potentially inconsistency that could arrive  when there is a long list of journeys.
 *          e.g. If the whole computation last more than seconds, the first computed encounter will yield inconsistent result with the last computed encounter.
 *
 * @constructor
 * @param {poi[]} pois List of POI
 * @param {Moment} current Moment object of "current" time, upon which the computation is based on.
 */
PoisMetricEngine = function(pois, current) {
  var poiIds = _.pluck(pois, '_id');
  this.journeys = Journeys.find({poiId: {$in: poiIds}}).fetch();
  this.current = moment(current);
};

/**
 * Compute the total number of visitors who have ever visited any of the pois
 * @returns {Number}
 */
PoisMetricEngine.prototype.computeTotalVisitorsCnt = function() {
  var users = _.reduce(this.journeys, function(memo, journey) {
    memo[journey.visitorUUID] = true;
    return memo;
  }, {});
  return Object.keys(users).length;
};

/**
 * Compute the current number of visitors still inside any of the poi regions
 * @returns {Number} current number of visitors */
PoisMetricEngine.prototype.computeCurrentVisitorsCnt = function() {
  var users = _.reduce(this.journeys, function(memo, journey) {
    if (journey.isVisiting()) memo[journey.visitorUUID] = true;
    return memo;
  }, {});
  return Object.keys(users).length;
};

/**
 * Compute the peak number of "current" visitors within a period
 * @param {Moment} from From period
 * @param {Moment} to To period
 * @returns {Number} peak count
 */
PoisMetricEngine.prototype.computePeakVisitorsCnt = function(from, to) {
  var self = this;
  var fromTime = from.valueOf();
  var toTime = to.valueOf();

  // Build an event list (each event contains i) ENTER/EXIT, ii) time, iii) visitor, with all journeys
  // and sort them by time
  var events = [];
  _.each(self.journeys, function(journey) {
    // TODO: Binary search to locate the relevant encounters directly instead of sequential search
    _.each(journey.encounters, function(encounter) {
      var enteredTime = encounter.enteredAt;
      var exitedTime = encounter.exitedAt !== null? encounter.exitedAt: self.current.valueOf();
      if (!(exitedTime < fromTime || enteredTime > toTime)) { // relevant
        events.push({type: 'enter', time: enteredTime, vid: journey.visitorUUID});
        events.push({type: 'exit', time: exitedTime, vid: journey.visitorUUID});
      }
    });
  });
  events.sort(function(a, b) {
    return a.time < b.time? -1: 1;
  });

  // Loop through the events, and keep a rolling maximum
  var visitorOpenedCounts = {}; // keep track of the number of non-closed encounters for each individual visitors
  var count = 0;  // keep track of the number of visitors having non-closed encounters
  var maxCount = 0; // keep track of all-time-maximum of "count"
  _.each(events, function(e) {
    visitorOpenedCounts[e.vid] = visitorOpenedCounts[e.vid] | 0;
    if (e.type === 'enter') {
      visitorOpenedCounts[e.vid]++;
      if (visitorOpenedCounts[e.vid] === 1) count++;
    } else if (e.type === 'exit') {
      visitorOpenedCounts[e.vid]--;
      if (visitorOpenedCounts[e.vid] === 0) count--;
    }
    maxCount = Math.max(maxCount, count);
  });
  return maxCount;
};

/**
 * Compute number of visitors who show interested in any of the poiss
 * @returns {Number} number of interested visitors
 */
PoisMetricEngine.prototype.computeInterestedCnt = function() {
  // TODO: implement
  return Math.floor(this.journeys.length * 0.1);
};

/**
 * Compute average dwell time per journey, with the following logic:
 *   1. per each journey, aggregate the duration of all encounters
 *   2. take an average of all the journeys computed in 1.
 *
 * @returns {Number} average dwell time in ms rouned down
 */
PoisMetricEngine.prototype.computeAvgDwellTime = function() {
  var self = this;
  var result = _.reduce(self.journeys, function(memo, journey) {
    var visitorAvgDwell = _.reduce(journey.encounters, function(memo, encounter) {
      return memo + encounter.duration(self.current);
    }, 0);
    return memo + visitorAvgDwell / self.journeys.length;
  }, 0);
  return Math.floor(result);
};
