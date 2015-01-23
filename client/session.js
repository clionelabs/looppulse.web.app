Session.extend = function (formKey, obj) {
    var s = Session.get(formKey)
    s = _.extend({}, s, obj);
    Session.set(formKey, s);
};
