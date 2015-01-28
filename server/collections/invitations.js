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
Invitations.create = function (doc) {
  var id = Invitations.insert(doc);
  var invitation = Invitations.findOne({_id: id});
  invitation.process();
}

Invitation = function (doc) {
  _.extend(this, doc);
};

_.extend(Invitation.prototype, {
  'isRequestorAuthorized': function () {
    var self = this;
    var organization = Organizations.findOne({_id: self.organizationId});
    return organization.isAccessibleByUserId(self.requestorId);
  },

  'process': function () {
    var self = this;

    // TODO: handle case when requestor is not authorized
    if (!self.isRequestorAuthorized()) {
      throw new Meteor.Error('invitation-not-authorized', 'Requestor does not have permission.');
    }

    // TODO: add invitation details so we can customize enrollment email
    var inviteeId = Accounts.createUser({email: self.inviteeEmail});
    Organizations.addUserById(self.organizationId, inviteeId);
    Accounts.sendEnrollmentEmail(inviteeId);
  }
});
