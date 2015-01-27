/**
 * Check for required server settings
 */
Settings = {
  check: function(settings) {
    // Required fields:
    if (settings.firebase.root === null) {
      console.error("[Settings] Missing firebase settings");
    }
  }
};
