// Script to clear all extension storage data
// Run this in Safari's console (Safari > Develop > Show JavaScript Console)
// Or paste this into the popup console

(async function() {
  console.log("🧹 Clearing all extension storage data...");
  
  try {
    // Get all storage data
    const allData = await browser.storage.local.get(null);
    console.log("Current data:", allData);
    
    // Get all keys
    const keys = Object.keys(allData);
    console.log(`Found ${keys.length} keys to remove`);
    
    if (keys.length > 0) {
      // Remove all keys
      await browser.storage.local.remove(keys);
      console.log("✅ All storage data cleared!");
    } else {
      console.log("ℹ️ No data found to clear");
    }
    
    // Set default state
    await browser.storage.local.set({
      xFeedBlockerEnabled: true,
      enabledAt: Date.now(),
      lastResetDate: new Date().toDateString(),
    });
    
    console.log("✅ Extension reset to default state!");
    console.log("🔄 Please reload the extension or restart Safari");
    
    return "Success! All data cleared.";
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    return "Error: " + error.message;
  }
})();

