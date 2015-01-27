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
2. Launch `meteor shell` in another terminal.
3. In the shell, run 

   `Meteor.call('createOrganizationAndUser', {name: 'org name'}, {email: 'email', password: 'pwd')`


Signing In and Logging Out
==========================

1. To sign in: `hostname/sign-in`
2. To log out: run `Meteor.logout()` in the browser console.

Technical Note
=================

- CSS: SCSS
- HTML: spacebars (aka. handlebars)
