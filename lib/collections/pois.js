/**
 * An Meteor collection for Poi objects {@link lib/models/poi.js}
 */
Pois = new Meteor.Collection("pois", {
  transform: function(doc) {
    var poi = new Poi();
    poi.initFromDoc(doc);
    return poi;
  }
})
