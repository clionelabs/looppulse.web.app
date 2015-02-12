

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

Template.pois.events({
  "click #gauge-download": function (e, tmpl) {
    // TODO: The click event should be captured from Template.gauge, which is then being delegated to here
    // TODO: Can we have a more robust way to retrieve workspace?
    var workspaceId = Workspaces.findOne()._id;
    Meteor.call('exportWorkspacePois', workspaceId, function(error, result) {
      if (error) {
        Notifications.error('Export CSV', 'Export CSV failed -- ' + error + ' --');
      } else {
        var uri = "data:text/csv;charset=utf-8," + escape(result);
        var filename =  workspaceId + "-" + "pois" +  "-" + moment().format() + ".csv";
        Template.triggerDownloadCSV(filename, uri);
      }
    });
  }
});
