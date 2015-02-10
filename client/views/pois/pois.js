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
        Router.go("workspaces/"+ Iron.controller().state.get('workspaceId') + "/engagement/create");
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

Template.pois.events({
  "click #gauge-download": function (e, tmpl) {
    // TODO: get workspaceId
    var workspaceId = "BtpqiPgu7xzC8PHdb";
    Meteor.call('exportPois', workspaceId, function(error, result) {
      if (error) {
        Notifications.error('Export CSV', 'Export CSV failed -- ' + error + ' --');
      } else {
        var headings = true;
        var quotes = true;
        var uri = "data:text/csv;charset=utf-8," + escape(result);
        var filename =  workspaceId + "-" + "pois" +  "-" + moment().format() + ".csv";

        // TODO: put the following lines into a utility function
        // window.open has ugly filename. use this hacky method to allow customizing filename
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          document.body.appendChild(link); // Firefox requires the link to be in the body
          link.download = filename;
          link.href = uri;
          link.click();
          document.body.removeChild(link); // remove the link when done
        } else {
          location.replace(uri);
        }
      }
    });
  }
});
