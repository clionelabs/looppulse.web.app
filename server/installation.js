Installation = {
  run: function(){
    //Initial system build up
    console.log("[Installation] Installation begin")
    this.createAccounts();
    console.log("[Installation] Installation finished. Remember to turn off the \`firstRun\` options")
  },
  createAccounts: function(){
    //Any account creation go here
    console.info("[Account] User Account Config on Server side")
    if (!Settings || !Settings.accounts) {
      console.info("[UserAccount] No user accounts setting found. skip.")
      return;
    }

    UserAccount.setupAdminUser(Settings.accounts.admin);
  }
}