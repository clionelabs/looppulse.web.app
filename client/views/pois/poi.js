Template.poi.rendered = function() {
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
  Template.poi.swipe(!isHeartActive);
};

Template.poi.helpers({
  "getTopPoisByInterestedVisitors" : function() {
    return this.poiMetric.topInterested;
  }
});

/**
 * A helper for other template to swipe
 * @param isActive
 */
Template.poi.swipe = function(isActive) {
  if (!isActive) {
    $(".container").slickNext();
  } else {
    $(".container").slickPrev();
  }
};
