Template.graphicsUploader.rendered = function() {
    var options = _.extend({}, Meteor.Dropzone.options, this.data);

    if (this.data.id) {
        this.dropzone = new Dropzone('#' + this.data.id + '.dropzone', options);
    } else {
       $(this.firstNode).dropzone(options);
    }

};