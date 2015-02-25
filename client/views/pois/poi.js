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
  "getTopRelatedPois" : function() {
    return this.poiMetric.topRelatedPois;
  }
});

Template.poi.events({
  "click #gauge-download": function (e, tmpl) {
    // TODO: The click event should be captured from Template.gauge, which is then being delegated to here
    // TODO: Can we have a more robust way to retrieve poi??
    var poi = Template.parentData(0).poiMetric.poi;
    var poiId = poi._id;
    Meteor.call('exportPoi', poiId, function(error, result) {
      if (error) {
        Notifications.error('Export CSV', 'Export CSV failed -- ' + error + ' --');
      } else {
        var uri = "data:text/csv;charset=utf-8," + escape(result);
        var filename =  poiId +  "-" + moment().format() + ".csv";
        Template.triggerDownloadCSV(filename, uri);
      }
    });
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
