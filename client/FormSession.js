FormSession = {};

FormSession = function(key, initObj) {
    this._key = key;

    if (!!initObj) {
        delete initObj._key;
        Session.set(key, initObj);
    }
    _.extend(this, Session.get(key));
}

FormSession.prototype.set = function(obj) {
    _.extend(this, obj);
    Session.set(this._key, this);
};
