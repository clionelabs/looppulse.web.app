
Template.poiNameSelector.helpers({
  get : function() {
    return PoisMetric.get().pois.map(Template.poiNameSelector.toSelectorObj);
  },
  selected: function(e, suggestion, dataset) {
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    console.log(suggestion);
    console.log(e);
    console.log(dataset);
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
