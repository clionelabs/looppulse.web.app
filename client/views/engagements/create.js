Template.engageCreate.selectedPoiSessionKey = "-engageCreate-selectedPoi";

Template.engageCreate.helpers({
   getSelectedPoi : function() {
       var key = Template.engageCreate.selectedPoiSessionKey;
       return Session.get(key);
   }
});

Template.engageCreate.destroyed = function() {
    Session.clear(selectedPoiSessionKey);
}

