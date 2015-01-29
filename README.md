looppulse.web.app
=================

Loop Pulse Application Server

Setup and run
=================

1. install meteor
2. change the settings.json.sample into settings.json
3. run with `meteor --settings server/settings.json`
4. setup security settings in firebase application for receiving events

   - Open the `Security and Rules` tab in your firebase application. Replace the content with the following:
  ```
  {
    "rules": {
      "workspaces": {
        "$wsId": {
          ".read": false,
          ".write": "auth != null && auth.wsId == $wsId"
        }
      }
    }
  }
  ```

Organization and Account Creation
======================================

1. Launch app.
2. Open the console on the browser ([Bug](https://github.com/meteor-velocity/velocity/issues/227) in Velocity prevents us doing the following in `meteor shell`)
3. Run

   `Meteor.call('createOrganizationAndUser', {name: 'org name'}, {email: 'email', password: 'pwd'})`


 Invitation
 ==========

 If you have already created an organization, you could also create an invitation on `meteor shell` with the following command:

  `Invitations.create({organizationId: YOUR_ORGANIZATION_ID, requestorId: REQUESTOR_ID, inviteeEmail: INVITEE_EMAIL})`


Signing In and Logging Out
==========================

1. To sign in: `hostname/sign-in`
2. To log out: run `Meteor.logout()` in the browser console.

Technical Note
=================

- CSS: SCSS
- HTML: spacebars (aka. handlebars)
