if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    beforeEach(function () {
      Meteor.users.remove({});
      Organizations.remove({});
      Invitations.remove({});
    });

    describe('Invitations#isRequestorAuthorized', function () {
      it('returns true if requestor also has access to given organization', function () {
        var orgId = Organizations.insert({name: 'org'});
        var userId= Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(orgId, userId);

        var invitation = new Invitation({organizationId: orgId,
                                         requestorId: userId});
        chai.assert.equal(invitation.isRequestorAuthorized(), true);
      });

      it('returns false otherwise', function () {
        var orgId = Organizations.insert({name: 'org'});
        var userId= Accounts.createUser({email:'u@example.com'});

        var invitation = new Invitation({organizationId: orgId,
                                         requestorId: userId});
        chai.assert.equal(invitation.isRequestorAuthorized(), false);
      });
    });

    describe('Invitations#process', function () {
      it('creates user from email', function () {
        var organizationId = Organizations.insert({name: 'org'});
        var requestorId= Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);

        var email = 'test@example.com';
        var invitation = new Invitation({organizationId: organizationId,
                                         requestorId: requestorId,
                                         inviteeEmail: email});
        invitation.process();
        chai.assert(Meteor.users.find().count(), 1);
      });

      it('gives organization access to newly created invitee account', function () {
        var organizationId = Organizations.insert({name: 'org'});
        var requestorId= Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);

        var email = 'test@example.com';
        var invitation = new Invitation({organizationId: organizationId,
                                         requestorId: requestorId,
                                         inviteeEmail: email});
        invitation.process();

        var organization = Organizations.findOne({_id: organizationId});
        var invitee = Meteor.users.findOne({'emails.address': email});
        chai.assert(organization.isAccessibleByUserId(invitee._id), true);
      });
    });
  });
}
