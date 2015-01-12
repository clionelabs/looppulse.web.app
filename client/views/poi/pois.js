/**
 * Created by g on 12/1/15.
 */
Template.pois.rendered = function() {
    $(".container").slick({
        infinite: false,
        slidesToShow: 2
    });
};

Template.pois.swipe = function(isActive) {
    if (isActive) {
        $(".container").slickNext();
    } else {
        $(".container").slickPrev();
    }
};