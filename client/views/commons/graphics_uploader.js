Template.graphicsUploader.rendered = function() {
    var options = _.extend({}, Meteor.Dropzone.options, this.data);
    $(this.firstNode).dropzone(options);
};