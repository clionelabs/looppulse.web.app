Template.organizationInvite.helpers({
  emailField: function(){
    return {
          _id: 'email',
          type: 'email',
          required: true,
          displayName: "email",
          re: /.+@(.+){2,}\.(.+){2,}/,
          errStr: 'Invalid email',
          placeholder: "email address"
    }
  },
  buttonText: function(){
    return "Send Invitation"
  }
})
Template.organizationInvite.events({
  "submit form" :function(e, tmpl){
    e.preventDefault();

    $("#at-btn").blur();

    AccountsTemplates.setDisabled(true);

    console.log(tmpl)
    var data = Template.currentData();
    // var userEmail = $("#at-field-email").val()
    // var organizationId = data._id

    // return Meteor.call("inviteOrganizationUser", organizationId, userEmail, function(error, result){

    // })
  }
})