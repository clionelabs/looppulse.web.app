//Load Everything remaining on start
//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('verifyEmail');

// Templates
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){1,}\.(.+){2,}/,
      errStr: 'Invalid email'
  }
]);

AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    required: true,
    minLength: 6,
    re: /(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
    errStr: 'At least 1 digit, 1 lower-case and 1 upper-case',
});
AccountsTemplates.addFields([
  {
      _id: "organizationName",
      type: "text",
      displayName: "Organization Name",
      placeholder: "Organization Name",
      required: true,
      minLength: 1,
      visible: ["signUp"]
  }
]);
AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    enforceEmailVerification: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: false,
    showPlaceholders: true,
    hideSignUpLink: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    // onLogoutHook: myLogoutFunc,
    // onSubmitHook: mySubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Create an account",
      },
      title: {
          forgotPwd: "Recover Your Password",
          signUp: "= Create an account =",
          // inviteNew: "Send invitation"
      },
    },
});

