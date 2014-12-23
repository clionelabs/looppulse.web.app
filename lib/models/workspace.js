/**
 * Workspaces
 *
 * Class constructor
 * @property {String} id
 * @property {String} name
 * @property {Object[]} applications Application: {appName: xxx, appId: xxx, appToken: xxx}
 */
Workspace = function() {
  this.id = null;
  this.name = null;
  this.applications = [];
}

Workspace.prototype.init = function(name, applications) {
  this.name = name;
  this.applications = applications;
}

Workspace.prototype.initFromDoc = function(doc) {
  this.init(doc.name, doc.apiToken);
  this.id = doc._id;
}

Workspace.prototype.save = function() {
  var selector = {_id: this.id};
  var modifier = {
    $set: {
      name: this.name,
      applications: this.applications
    }
  }
  var result = Workspaces.upsert(selector, modifier);
  if (result.insertedId) {
    this._id = result.insertedId;
  } else {
    this._id = Workspaces.findOne(selector)._id;
  }
  return this._id;
}
