// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.commands.onCommand.addListener(function(command) {
    // Now, do whatever you want when the shortcut is triggered.
    if (command === "Target SFDC") {
      chrome.tabs.executeScript(null, {file: "content_nomsg.js"});
    } else if (command === "Target Login") {
      chrome.tabs.executeScript(null, {file: "content2.js"});
    } else if (command === "Target Bug") {
      chrome.tabs.executeScript(null, {file: "content3.js"});
    } else if (command === "Target Task") {
      chrome.tabs.executeScript(null, {file: "content4.js"});
    }
});

// This block is new!
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);
