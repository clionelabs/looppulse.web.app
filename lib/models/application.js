/**
 * Application
 *
 * Class constructor
 * @property {String} id
 * @property {String} name
 * @property {String} apiToken Token for API authentication
 */
Application = function() {
  this.id = null;
  this.name = null;
  this.apiToken = null;
}

Application.prototype.init = function(name, apiToken) {
  this.name = name;
  this.apiToken = apiToken;
}

Application.prototype.initFromDoc = function(doc) {
  this.init(doc.name, doc.apiToken);
  this.id = doc._id;
}

Application.prototype.save = function() {
  var selector = {_id: this.id};
  var modifier = {
    $set: {
      name: this.name,
      apiToken: this.apiToken
    }
  }
  var result = Applications.upsert(selector, modifier);
  if (result.insertedId) {
    this._id = result.insertedId;
  } else {
    this._id = Applications.findOne(selector)._id;
  }
  return this._id;
}
