

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

  var isHeartActive = Session.get("isHeartActive");
  Template.pois.swipe(!isHeartActive);
};

Template.pois.helpers({
  "getTop3PoisByInterestedVisitors" : function() {
    return this.poisMetric.topInterested;
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
