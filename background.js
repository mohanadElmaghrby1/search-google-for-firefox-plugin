// Put all the javascript code here, that you want to execute in background.

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
    if (browser.runtime.lastError) {
      console.log(`Error: ${browser.runtime.lastError}`);
    } else {
      console.log("Item created successfully");
    }
  }
  
  /*
  Called when the item has been removed.
  We'll just log success here.
  */
  function onRemoved() {
    console.log("Item removed successfully");
  }
  
  /*
  Called when there was an error.
  We'll just log the error here.
  */
  function onError(error) {
    console.log(`Error: ${error}`);
  }
  
  /*
  Create all the context menu items.
  */
  browser.menus.create({
    id: "log-selection",
    title: browser.i18n.getMessage("menuItemSearchInGoogle"),
    contexts: ["selection"]
  }, onCreated);
  
  browser.menus.create({
    id: "remove-me",
    title: browser.i18n.getMessage("menuItemSearchInMCP"),
    contexts: ["selection"]
  }, onCreated);
  
  /*
  The click event listener, where we perform the appropriate action given the
  ID of the menu item that was clicked.
  */
  //  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/onClicked
  browser.menus.onClicked.addListener((info, tab)=> {
    var creating = browser.tabs.create({
      url:`https://www.google.com/search?q=${info.selectionText}`
    });
    creating.then(onCreated, onError);
  });