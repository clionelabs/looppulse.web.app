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
        return _.str.pad(d.hours(), 2, "0") + ":" + _.str.pad(d.minutes(), 2, "0");
    } else {
        return _.str.pad(d.minutes(), 2, "0") + ":" + _.str.pad(d.seconds(), 2, "0");
    }
});

Template.registerHelper("printActiveIf", function(funcOrBoolean) {
    if(_.isFunction(funcOrBoolean)) {
        return funcOrBoolean() ? "active" : "";
    } else {
        return funcOrBoolean ? "active" : "";
    }
});
