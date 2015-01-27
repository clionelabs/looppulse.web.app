looppulse.web.app
=================

Loop Pulse Application Server

Setup and run
=================

1. install meteor
2. change the settings.json.dist into settings.json
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

Technical Note
=================

- CSS: SCSS
- HTML: spacebars (aka. handlebars)
