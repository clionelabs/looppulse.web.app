Template.pois.rendered = function() {
    $(".container").slick({
        infinite: false,
        swipe: false,
        slidesToShow: 2,
        onBeforeChange: function(self, currentIndex, targetIndex) {
            Template.gauge.toggleActive($("#gauge-heart"));
        },
        arrows: false
    });
};


Template.pois.events({
    "click #pois-goto-create-engage" : function() {
        Router.go("/engagement/create");
    }
});

Template.pois.helpers({
  "getTop3PoisByInterestedVisitors" : function() {
    return this.poisMetric.top3Interested;
  }
});

/**
 * A helper for other template to swipe
 * @param isActive
 */
Template.pois.swipe = function(isActive) {
    if (!isActive) {
        $(".container").slickNext();
    } else {
        $(".container").slickPrev();
    }
};



