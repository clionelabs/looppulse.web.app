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

Template.pois.getShortenedPois = function(pois, reduceFunc, key) {

  var shortenedPois = _.first(pois, 3);

  if (pois.length > 1) {
    var totalOfTheRest =
      _.reduce(_.rest(pois, 3), reduceFunc, 0);

    var otherObj = {name : "Other"};
    otherObj[key] = totalOfTheRest;
    shortenedPois.push(otherObj);
  }

  return shortenedPois;
};