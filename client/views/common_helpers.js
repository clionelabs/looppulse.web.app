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
 * @param sessionMap is in this format
 * {
 *   key1 : value1,
 *   key2 : value2,
 *   ...
 * }
 */
Template.initSession = function(sessionMap) {
    var keys = Object.keys(sessionMap);
    _.each(keys, function (i) {
        if (!Session.get(i)) {
            Session.set(i, sessionMap[i]);
        } else {
            console.warn(sessionMap[i] + " is initialized before.");
        }
    });
};
