UserAccount = {
  "WS_PREFIX": "-ws-",
  "ORG_PREFIX": "-org-",
  // Get user org group
  // return Array for general user with organization
  getUserOrgGroups: function(user){
    var orgIds = [];
    var self = this;
    if (user.orgIds) {
      orgIds = user.orgIds.map(function(orgId){
        return self.getOrgId(orgId)
      })
    }

    return orgIds;
  },
  // Get user workspace group
  // return Array for general user with workspace
  getUserWsGroups: function(user){
    var wsIds = [];
    var self = this;
    if (user.wsIds) {
      wsIds = user.wsIds.map(function(wsId){
        return self.getWsGroup(wsId)
      })
    }

    return wsIds;
  },
  getOrgGroup:function(orgId) {
    return UserAccount.ORG_PREFIX + orgId;
  },
  getWsGroup: function(wsId) {
    return UserAccount.WS_PREFIX + wsId;
  }
}