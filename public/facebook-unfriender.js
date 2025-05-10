/**
 * Facebook Friend Mass Unfriender
 * 
 * This script helps you unfriend multiple Facebook friends using browser automation.
 * Copy and paste this script into your browser console while on the Facebook friends page.
 * 
 * HOW TO USE:
 * 1. Login to Facebook
 * 2. Go to https://www.facebook.com/friends/list
 * 3. Open browser developer tools (F12 or right-click -> Inspect)
 * 4. Copy this entire script and paste it into the Console tab
 * 5. Run the command: deleteThisMany(400) 
 *    (change 400 to the number of friends you want to unfriend)
 * 
 * WARNING: This action cannot be undone. Use at your own risk.
 */

(function() {
  console.log("=== Facebook Friend Mass Unfriender ===");
  
  // Variables to track progress
  let processedCount = 0;
  let unfriendedCount = 0;
  let processedButtons = new Set();
  let loopCounter = 0;
  
  // Function to find all More buttons
  function findMoreButtons() {
    const menuButtons = document.querySelectorAll('div[aria-label*="More"]');
    console.log(`Found ${menuButtons.length} More buttons`);
    return Array.from(menuButtons);
  }
  
  // Generate a fingerprint for a button to detect duplicates
  function getButtonFingerprint(button) {
    const parent = button.parentElement;
    const parentText = parent ? parent.textContent || '' : '';
    const rect = button.getBoundingClientRect();
    return `${parentText.substring(0, 20)}_${rect.top}_${rect.left}`;
  }
  
  // Function to scroll down to load more friends
  function scrollDown() {
    const scrollableArea = document.querySelector('div[role="main"]');
    if (scrollableArea) {
      const currentPos = scrollableArea.scrollTop;
      const newPos = currentPos + 500;
      scrollableArea.scrollTo(0, newPos);
      console.log(`Scrolled from ${currentPos}px to ${newPos}px`);
    } else {
      const currentPos = window.scrollY;
      const newPos = currentPos + 500;
      window.scrollTo(0, newPos);
      console.log(`Scrolled window from ${currentPos}px to ${newPos}px`);
    }
  }
  
  // Process the friends
  function processFriends(maxFriends) {
    // Find More buttons
    const buttons = findMoreButtons();
    
    // Check if we've processed all friends or reached max
    if (processedCount >= maxFriends) {
      console.log(`Reached maximum of ${maxFriends} friends processed`);
      showSummary();
      return;
    }
    
    // Filter out buttons we've already processed
    const unprocessedButtons = buttons.filter(button => {
      const fingerprint = getButtonFingerprint(button);
      return !processedButtons.has(fingerprint);
    });
    
    console.log(`Found ${unprocessedButtons.length} new unprocessed buttons`);
    
    if (unprocessedButtons.length === 0) {
      loopCounter++;
      
      if (loopCounter > 5) {
        console.log("Detected possible loop - no new friends after multiple scrolls");
        showSummary();
        return;
      }
      
      console.log("No new buttons found, scrolling to load more...");
      scrollDown();
      
      setTimeout(() => {
        processFriends(maxFriends);
      }, 2000);
      return;
    }
    
    // Reset loop counter since we found new buttons
    loopCounter = 0;
    
    // Process the first unprocessed button
    const buttonToProcess = unprocessedButtons[0];
    const fingerprint = getButtonFingerprint(buttonToProcess);
    processedButtons.add(fingerprint);
    
    processedCount++;
    console.log(`Processing friend ${processedCount}/${maxFriends}`);
    
    // Click the More button
    buttonToProcess.click();
    console.log("Clicked More button");
    
    // Wait for menu to appear
    setTimeout(() => {
      // Look for options in the menu
      const menuItems = document.querySelectorAll('div[role="menuitem"]');
      console.log(`Found ${menuItems.length} menu items`);
      
      // Debug menu items
      const menuTexts = Array.from(menuItems).map(item => item.textContent);
      console.log("Menu options:", menuTexts.join(", "));
      
      // Find unfriend option
      const unfriendOption = Array.from(menuItems).find(item => {
        const text = (item.textContent || '').toLowerCase();
        return text.includes("unfriend") || text.includes("remove friend");
      });
      
      if (unfriendOption) {
        console.log("Found Unfriend option - clicking it");
        unfriendOption.click();
        
        // Wait for confirmation dialog
        setTimeout(() => {
          // Look for confirm buttons
          const confirmButtons = Array.from(document.querySelectorAll('div[role="button"]'))
            .filter(button => {
              const text = (button.textContent || '').toLowerCase();
              return text.includes("confirm") || text.includes("remove") || text.includes("unfriend");
            });
          
          if (confirmButtons.length > 0) {
            console.log("Clicking confirm button");
            confirmButtons[0].click();
            unfriendedCount++;
          } else {
            console.log("No confirm button found");
            document.body.click();
          }
          
          // Move to next friend
          setTimeout(() => processFriends(maxFriends), 2000);
        }, 1500);
      } else {
        console.log("No Unfriend option found");
        document.body.click();
        setTimeout(() => processFriends(maxFriends), 1000);
      }
    }, 1500);
  }
  
  // Show summary
  function showSummary() {
    console.log("==== SUMMARY ====");
    console.log(`Total friends processed: ${processedCount}`);
    console.log(`Friends unfriended: ${unfriendedCount}`);
    console.log(`Unique buttons found: ${processedButtons.size}`);
    console.log("=================");
  }
  
  // Create global function to start the process with one parameter
  window.deleteThisMany = function(numberOfFriends) {
    processedCount = 0;
    unfriendedCount = 0;
    processedButtons = new Set();
    loopCounter = 0;
    
    console.log(`Starting to process ${numberOfFriends} friends`);
    processFriends(numberOfFriends);
  };
  
  console.log("IMPORTANT: Use deleteThisMany(400) to unfriend 400 friends");
})(); 