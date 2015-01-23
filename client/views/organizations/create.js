// Simply 'inherites' helpers from AccountsTemplates
Template.atCreateForm.helpers(AccountsTemplates.atFormHelpers);
// Simply 'inherits' helpers from AccountsTemplates
Template.atCreatePwdForm.helpers(AccountsTemplates.atPwdFormHelpers);

Template.atCreatePwdForm.events({
  "submit #at-pwd-form" : function(e, tmpl){
    console.log("Hello");
    e.preventDefault();
    e.stopPropagation(); //disable other handler

    $("#at-btn").blur();

    AccountsTemplates.setDisabled(true);



    var parentData = Template.currentData();
    var state = "signUp";
    var preValidation = (state !== "signIn");
    // Client-side pre-validation
    // Validates fields values
    // NOTE: This is the only place where password validation can be enforced!
    var formData = {};
    var someError = false;
    var errList = [];
    _.each(AccountsTemplates.getFields(), function(field){
        // Considers only visible fields...
        console.log("Queue", field, state)
        if (!_.contains(field.visible, state))
            return;


        var fieldId = field._id;
        var rawValue = field.getValue(tmpl);
        var value = field.fixValue(rawValue);
        // Possibly updates the input value
        console.log(field, value)
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

    console.log("form Data: ", formData)

    // Extracts username, email, and pwds
    var current_password = formData.current_password;
    var email = formData.email;
    var password = formData.password;
    var password_again = formData.password_again;
    var organizationName = formData.organizationName;

    // Clears profile data removing username, email, and pwd
    delete formData.current_password;
    delete formData.email;
    delete formData.password;
    delete formData.password_again;
    delete formData.organizationName;

    if (AccountsTemplates.options.confirmPassword){
        // Checks passwords for correct match
        if (password_again && password !== password_again){
            var pwd_again = AccountsTemplates.getField("password_again");
            if (pwd_again.negativeValidation)
                pwd_again.setError(AccountsTemplates.texts.errors.pwdMismatch);
            else
                AccountsTemplates.state.form.set("error", [{
                    field: pwd_again.getDisplayName(),
                    err: AccountsTemplates.texts.errors.pwdMismatch
                }]);
            AccountsTemplates.setDisabled(false);
            return;
        }
    }

    var hash = AccountsTemplates.hashPassword(password);
    return false;
    console.log("Ready, calling remote.", { name: organizationName })

    Meteor.call("createOrganizationAndUser",
      { name: organizationName } ,
      { email:email, password:hash } ,
      function(error, result){
        console.log(error, result)
        AccountsTemplates.submitCallback(error, undefined, function(){
          if (AccountsTemplates.options.sendVerificationEmail && AccountsTemplates.options.enforceEmailVerification){
              AccountsTemplates.state.form.set("result", AccountsTemplates.texts.info.signUpVerifyEmail);
              // Cleans up input fields' content
              $("#at-pwd-form").remove()
              return;
          }
      });
    })

    return false;
  }
})