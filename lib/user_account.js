UserAccount = {
  "WS_PREFIX": "-ws-",
  "ORG_PREFIX": "-org-",
  // Get user org group
  // return Array for general user with organization
  getUserOrgGroups: function(user){
    var orgIds = [];

    if (user.orgIds) {
      orgIds = user.orgIds.map(function(o){
        return UserAccount.ORG_PREFIX + o;
      })
    }

    return orgIds;
  },
  // Get user workspace group
  // return Array for general user with workspace
  getUserWsGroups: function(user){
    var wsIds = [];

    if (user.wsIds) {
      wsIds = user.wsIds.map(function(o){
        return UserAccount.WS_PREFIX + o;
      })
    }

    return wsIds;
  }
}