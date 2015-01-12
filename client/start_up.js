/**
 * Here are some shim of functions to
 */
Meteor.startup(function() {
    $.fn.toggleSVGClass = function(value) {
        var currentClass = this.attr("class");
        if (!currentClass.contains(value)) {
            this.attr("class", currentClass + " " + value);
        } else {
            this.attr("class", currentClass.replace(value, ''));
        }
    }

    $.fn.hasSVGClass = function(className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.attr('class'));
    }
});