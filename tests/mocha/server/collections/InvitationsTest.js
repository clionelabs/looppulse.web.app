if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    beforeEach(function () {
      Meteor.users.remove({});
      Organizations.remove({});
      Invitations.remove({});
      chai.should();
      chai.use(sinonChai);
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

    describe('Invitations.validate', function () {
      beforeEach(function () {
        var organizationId = Organizations.insert({name: 'org'});
        var requestorId = Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);
        options = { organizationId: organizationId,
                    requestorId: requestorId,
                    inviteeEmail: 'invited@example.com' };
      });

      it('checks for unauthroized requestor', function () {
        var spy = sinon.spy(Invitations, 'rejectUnauthorizedRequestor');

        Invitations.validate(options);
        spy.called.should.be.true;
      });

      it('checks for invitee who already has an account', function () {
        var spy = sinon.spy(Invitations, 'rejectExitingInvitee');

        Invitations.validate(options);
        spy.called.should.be.true;
      });
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
      beforeEach(function () {
        var organizationId = Organizations.insert({name: 'org'});
        var requestorId = Accounts.createUser({email:'u@example.com'});
        Organizations.addUserById(organizationId, requestorId);
        options = { organizationId: organizationId,
                    requestorId: requestorId,
                    inviteeEmail: 'invited@example.com' };
      });

      it('creates user from invitee email', function () {
        Invitations.create(options);

        Meteor.users.find().count().should.equal(2); // requestor + invitee
      });

      it('gives organization access to newly created invitee account', function () {
        Invitations.create(options);

        var organization = Organizations.findOne({_id: options.organizationId});
        var invitee = Meteor.users.findOne({'emails.address': options.inviteeEmail});
        organization.isAccessibleByUserId(invitee._id).should.equal(true);
      });
    });
  });
}
