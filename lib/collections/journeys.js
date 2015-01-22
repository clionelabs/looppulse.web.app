/**
 * Meteor collection for journey.
 *
 * A journey object contains a list of encounters happened between a particular POI for a particular visitor.
 *   An encounter, on the other hand, is a pair of entering time and exiting time, pertaining to a single visit.
 * The objective of this class is to provide an intermediate layer between the noisy beaconEvents and metrics computation.
 *
 * In short, raw beacon events are noisy in the following senses:
 *   1) Mobile devices (mainly IOS) generates a whole bunch of raw ENTER and EXIT events even though the person stays within the beacon region.
 *   2) Invalid or missing events, e.g. an ENTER event followed by another ENTER event without ever receiving an EXIT.
 *
 * The internal implemetation of this class will:
 *   1) Combine multiple encounters into one, if they happen within a grace period.
 *   2) Filter out invalid events, e.g. Ignore the corresponding EXIT event if we suspect an ENTER event being lost.
 *
 * Therefore, it's a safe to assume the followings to the constructed encounters list:
 *   1) The encounters list will be of the form [encounter1, encounter2, encounter3, ...], with the elements sorted in chronological order.
 *   2) A single encounter corresponds to a real single visit (meaning that the visitor has actually arrived and left a poi region. i.e. not because of noisy signals).
 *   3) The last encounter in the list might be an opened encounter
 *      - An opened encounter is defined as one that only has entering time, but not exiting time.
 *      - Having an opened encounter at the end of the list means that the visitor is currently still inside the poi region
 *
 * Document property:
 * @property {String} poiId
 * @property {String} visitorUUID
 * @property {Object[]} encounters Each encounter is of the form {enteredAt: xxx, exitedAt: yyy, duration: zzz}
 *   {Number} enteredAt Unix timestamp in milliseconds
 *   {Number} exitedAt Unix timestamp in milliseconds
 *   {Number} duration Difference between exitedAt and enteredAt in seconds
**/
Journeys = new Meteor.Collection('journeys', {
  transform: function(doc) {
    return new Journey(doc);
  }
});

/**
 * An object class to encapsulte a single journey
 */
Journey = function(doc) {
  _.extend(this, doc);
  this.encounters = _.map(this.encounters, function(doc) {
    return new JourneyEncounter(doc);
  });
};

/**
 * Check whether the visiting is still currently visiting the poi (i.e. having an non-closed encounter)
 * returns {Boolean} true if visiting, false otherwise
 */
Journey.prototype.isVisiting = function() {
  if (this.encounters.length === 0) return false;
  return !_.last(this.encounters).isClosed();
};

/**
 * An object class to encapsulate a single encounter of the encounter list in Journey
 */
JourneyEncounter = function(doc) {
  _.extend(this, doc);
};

/**
 * Return the duration in ms
 * If exitedAt is null (i.e. user is still currently at the beacon), then duration = current - enteredAt, otherwise it's exitedAt - enteredAt
 * For some use case, we want to use an pre-defined "current" time instead of the real system current time. So this method allow setting an explitiy current time.
 *
 * @param Optional {Moment} current Moment object of current time, upon which the computation based on. If not specified, than use system current time.
 * @return {Number} Duration is milliseconds
 */
JourneyEncounter.prototype.duration = function(current) {
  if (!current) current = moment();
  if (this.isClosed()) {
    var duration = moment(this.exitedAt).diff(this.enteredAt);
  } else {
    var duration = current.diff(this.enteredAt);
  }
  return duration;
};

/**
 * Check whether the encounter is closed (i.e. visitor has left the poi region)
 * @return {Boolean}
 */
JourneyEncounter.prototype.isClosed = function() {
  return this.exitedAt !== null;
}
