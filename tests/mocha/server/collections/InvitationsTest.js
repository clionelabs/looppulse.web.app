if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    beforeEach(function () {
      Meteor.users.remove({});
      Organizations.remove({});
      Invitations.remove({});
      chai.should();
    });

    describe('Invitations.pending', function () {
      it('returns the pending invitations on given invitee email', function () {
        var inviteeEmail = 'invited@example.com';
        var organizationId = Organizations.insert({name: 'Test Org'});
        var requestorId = Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);

        Invitations.create({organizationId: organizationId,
                            requestorId: requestorId,
                            inviteeEmail: inviteeEmail});
        Invitations.pending(inviteeEmail).should.have.length(1);
      });
    });

    describe('Invitations#isRequestorAuthorized', function () {
      it('returns true if requestor also has access to given organization', function () {
        var orgId = Organizations.insert({name: 'org'});
        var userId= Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(orgId, userId);

        var invitation = new Invitation({organizationId: orgId,
                                         requestorId: userId});
        invitation.isRequestorAuthorized().should.equal(true);
      });

      it('returns false otherwise', function () {
        var orgId = Organizations.insert({name: 'org'});
        var userId= Accounts.createUser({email:'u@example.com'});

        var invitation = new Invitation({organizationId: orgId,
                                         requestorId: userId});
        invitation.isRequestorAuthorized().should.equal(false);
      });
    });

    describe('Invitations.create', function () {
      it('creates user from invitee email', function () {
        var organizationId = Organizations.insert({name: 'org'});
        var requestorId = Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);

        Invitations.create({organizationId: organizationId,
                            requestorId: requestorId,
                            inviteeEmail: 'test@example.com'});
        Meteor.users.find().count().should.equal(2); // requestor + invitee
      });

      it('gives organization access to newly created invitee account', function () {
        var organizationId = Organizations.insert({name: 'org'});
        var requestorId = Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);

        var inviteeEmail = 'test@example.com';
        Invitations.create({organizationId: organizationId,
                            requestorId: requestorId,
                            inviteeEmail: inviteeEmail});

        var organization = Organizations.findOne({_id: organizationId});
        var invitee = Meteor.users.findOne({'emails.address': inviteeEmail});
        organization.isAccessibleByUserId(invitee._id).should.equal(true);
      });
    });
  });
}
