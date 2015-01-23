Template.atInviteForm.helpers(AccountsTemplates.atFormHelpers);
// Simply 'inherits' helpers from AccountsTemplates
Template.atInvitePwdForm.helpers(AccountsTemplates.atPwdFormHelpers);

Template.atInvitePwdForm.events({
  "submit #at-pwd-form":function(e, tmpl){
    e.preventDefault();

    $("#at-btn").blur();

    AccountsTemplates.setDisabled(true);
    console.log("Ready", tmpl)

    var parentData = Template.currentData();
    var state = "inviteNew";
    var preValidation = (state !== "signIn");
    // Client-side pre-validation
    // Validates fields values
    var formData = {};
    var someError = false;
    var errList = [];
    _.each(AccountsTemplates.getFields(), function(field){
        // Considers only visible fields...
        if (!_.contains(field.visible, state))
            return;


        var fieldId = field._id;
        var rawValue = field.getValue(tmpl);
        var value = field.fixValue(rawValue);
        // Possibly updates the input value
        if (value !== rawValue)
            field.setValue(tmpl, value);
        if (value !== undefined && value !== "")
            formData[fieldId] = value;


        var validationErr = field.validate(value, "strict");
        if (validationErr) {
            if (field.negativeValidation)
                field.setError(validationErr);
            else{
                var fId = T9n.get(field.getDisplayName(), markIfMissing=false);
                //errList.push(fId + ": " + err);
                errList.push({
                    field: field.getDisplayName(),
                    err: validationErr
                });
            }
            someError = true;
        }
        else
            field.setSuccess();

    });
    // Clears error and result
    AccountsTemplates.clearError();
    AccountsTemplates.clearResult();
    // Possibly sets errors
    if (someError){
        if (errList.length)
            AccountsTemplates.state.form.set("error", errList);
        AccountsTemplates.setDisabled(false);
        return;
    }


    // Extracts username, email, and pwds
    var email = formData.email;
    var organizationId = Template.currentData().id; //current is caller data...parentData is just only Organization Data

    // Clears profile data removing username, email, and pwd
    delete formData.email;

    console.log("Data", email, organizationId)

    // var userEmail = $("#at-field-email").val()
    // var organizationId = data._id

    // return Meteor.call("inviteOrganizationUser", organizationId, userEmail, function(error, result){

    // })
  }
})