/**
  * Invitaton
  *
  * Document property
  * @property {String} organizationId {@link Organization}
  * @property {String} requestorId {@link User}
  * @property {String} inviteeEmail
  */
Invitations = new Meteor.Collection('invitations', {
  transform: function(doc) {
    return new Invitation(doc);
  }
});

// TODO: better if we could put the logic in User#pendingInvitations
Invitations.pending = function (inviteeEmail) {
  return Invitations.find({inviteeEmail: inviteeEmail}).fetch();
}

/**
  * TODO: Normally, we would observe 'added' invitation in order to
  * start the processing. However, due to limitation by testing (
  * Mongo collections get removed in 'beforeEach()'), we need to ensure
  * required work is done synchronously.
  */
Invitations.create = function (options) {
  // TODO: we could run the validation at insert time.
  Invitations.validate(options);
  Invitations.insert(options);

  // TODO: add invitation details so we can customize enrollment email
  var inviteeId = Accounts.createUser({email: options.inviteeEmail});
  Organizations.addUserById(options.organizationId, inviteeId);
  Accounts.sendEnrollmentEmail(inviteeId);
}

Invitations.validate = function (options) {
  Invitations.rejectUnauthorizedRequestor(options.organizationId, options.requestorId);
  Invitations.rejectExitingInvitee(options.inviteeEmail);
}

Invitations.rejectUnauthorizedRequestor = function (organizationId, requestorId) {
  var organization = Organizations.findOne({_id: organizationId});
  if(!organization || !organization.isAccessibleByUserId(requestorId)) {
    throw new Meteor.Error('invitation-not-authorized', 'Requestor does not have permission.');
  }
}

Invitations.rejectExitingInvitee = function (inviteeEmail) {
  if (Meteor.users.findOne({'emails.address': inviteeEmail})) {
    throw new Meteor.Error('invitation-to-existing-user',
                           'Currently we only support invitation to new user account');
  }
}

Invitation = function (doc) {
  _.extend(this, doc);
};
