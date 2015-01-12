/**
 * POI stands for Point of Interests
 *
 * Document property
 * @property {String} wsId {@link Workspace}
 * @property {String} name
 * @property {Object} beacon
 */
Pois = new Meteor.Collection("pois", {
  transform: function(doc) {
    return new Poi(doc);
  }
});

Poi = function(doc) {
  _.extend(this, doc);
};
