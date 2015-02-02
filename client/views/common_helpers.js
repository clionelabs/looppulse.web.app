/**
 * Here holds all common helpers in all templates
 */

/**
 * Passover for template to use underscore functions.
 */
Template.registerHelper("_", function() {
    return _;
});

Template.registerHelper("formatDuration", function(duration) {
    var d = moment.duration(+duration);
    if (d.hours() > 0) {
        return d.hours() + ":" + d.minutes();
    } else {
        return d.minutes() + ":" + d.seconds();
    }
});

Template.registerHelper("printActiveIf", function(funcOrBoolean) {
    if(_.isFunction(funcOrBoolean)) {
        return funcOrBoolean() ? "active" : "";
    } else {
        return funcOrBoolean ? "active" : "";
    }
});

/**
 * To reduce a list of pois to a list of 4 pois, with the common structure of {name : "", key : poi[key]}
 * @param pois
 * @param reduceFunc
 * @param key
 * @param limit
 * @returns {*}
 */
Template.pois.getShortenedPois = function(pois, reduceFunc, key, limit) {

  if (limit === undefined) { limit = 3; }
  var shortenedPois = _.first(pois, limit);

  if (pois.length > limit) {
    var totalOfTheRest =
      _.reduce(_.rest(pois, limit), reduceFunc, 0);

    var otherObj = {name : "Others"};
    otherObj[key] = totalOfTheRest;
    shortenedPois.push(otherObj);
  }

  return shortenedPois;
};