
Template.poiNameSelector.helpers({
  get : function() {
    if (PoisMetric.get()) {
      return PoisMetric.get().pois.map(Template.poiNameSelector.toSelectorObj);
    } else {
      return [];
    }
  },
  selected: function(e, suggestion, dataset) {
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    Session.extend(sessionKey, { "selectedPoi" : suggestion });
    $("#poiSelectionModal").modal('hide');
    }
});

Template.poiNameSelector.rendered = function() {

    Meteor.typeahead.inject();

    $("#poiSelectionModal").on('shown.bs.modal', function() {
        $("#pois-selection-input").focus();
    });
};

Template.poiNameSelector.toSelectorObj = function(item) {
  return { id : item._id, value : item.name, interestedVisitors : item.interestedVisitors, totalVisitors : item.totalVisitors };
};
