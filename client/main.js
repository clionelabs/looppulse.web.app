/**
 * Here are some shim of functions
 */
$.fn.toggleSVGClass = function(value) {
    var currentClass = this.attr("class");
    if (currentClass.indexOf(value) === -1) {
        this.attr("class", currentClass + " " + value);
    } else {
        this.attr("class", currentClass.replace(value, ''));
    }
};

$.fn.hasSVGClass = function(className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.attr('class'));
};

/**
 * Not bother with a more elegant solution
 * @param selectorToShow jquery selector string
 * @param selectorToHide jquery selector string
 */
$.toggleView = function(selectorToShow, selectorToHide) {
    var toHide = $(selectorToHide);
    var toShow = $(selectorToShow);
    if (toHide.is(":visible") && toShow.is(":hidden")) {
        toHide.fadeOut().promise().done(function() {
            toShow.fadeIn();
        });
    } else {
        console.error("element state is not ok");
    }
};
