if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe("createWorkspaceAndOrganizationAndUser", function() {

      var demoWorkspace =
        {
          "name" : "ws",
          "poiDescriptors": {one: "restaurant", "many" : "restaurants" }
        };
      var demoOrganization = {"name" : "Beta"};
      var demoUser = {email : "g@g.com"};
      var addedUserId;

      before(function () {
        chai.should();
        //For some reason it is not called in the meteor-sinon package
        chai.use(sinonChai);
      });

      beforeEach(function () {
        addedUserId = Meteor.call("createWorkspaceAndOrganizationAndUser", demoWorkspace, demoOrganization, demoUser);
      });

      it("create user with right email", function() {
        //not very good
        Meteor.users.find().count().should.equal(1);
        var user = Meteor.users.findOne({_id : addedUserId});
        _.find(user.emails, function(it) { return _.isEqual(it.address, "g@g.com"); }).should.not.be.undefined;
      });

      it("create organization that can be referenced by userId", function() {
        var user = Meteor.users.findOne({_id : addedUserId});
        var organization = Organizations.findByUserId(user._id);
        organization.should.not.be.undefined;
      });

      it("create workspace that can be referenced by organization._id", function() {
        var user = Meteor.users.findOne({_id : addedUserId});
        var organization = Organizations.findByUserId(user._id);
        var workspace = Workspaces.find({organizationId : organization._id});
        workspace.should.not.undefined;
      });

      afterEach(function() {
        spies.restoreAll();
        Meteor.users.remove({});
        Organizations.remove({});
        Workspaces.remove({});
      });

    })

  });
}