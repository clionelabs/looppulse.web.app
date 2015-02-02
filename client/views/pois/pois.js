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
    console.log(this.poisMetric.pois);
    var pois = _.sortBy(this.poisMetric.pois, function(p) { return -p.interestedVisitors; } );
    return Template.pois.getShortenedPois(pois,
                     function (memo, p) {
                        return memo + p.interestedVisitors;
                     }, "interestedVisitors");
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



