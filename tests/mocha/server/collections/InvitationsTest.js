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

    // TODO: can't get pending tests to work.
    // https://github.com/mad-eye/meteor-mocha-web/issues/43
    describe('Invitations.validate', function () {
      it('checks for unauthroized requestor')
      it('checks for invitee who already has an account')
    });

    describe('Invitations.validateExistingInvitee', function () {
      it('throws when sending invitation to existing user', function () {
        var email = 'invited@example.com';
        var userId = Accounts.createUser({email: email});

        var organizationId = Organizations.insert({name: 'org'});
        var requestorId = Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);

        chai.expect(function () {
          Invitations.rejectExitingInvitee(email);
        }).to.throw();
      });
    });

    describe('Invitations.rejectUnauthorizedRequestor', function () {
      it('throws when requestor does not have authroixation', function () {
        var organizationId = Organizations.insert({name: 'org'});
        var requestorId = Accounts.createUser({email:'u@example.com'});

        chai.expect(function () {
          Invitations.rejectUnauthorizedRequestor(organizationId, requestorId);
        }).to.throw();
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
