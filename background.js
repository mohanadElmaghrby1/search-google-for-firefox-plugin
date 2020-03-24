// Put all the javascript code here, that you want to execute in background.
"use strict";

const MENU_ID = "MDA_MENU_ID"
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
  
  browser.contextMenus.create({
    id:MENU_ID,
    title   : 'Search MDA for "%s"',
    contexts: ["selection","link"],
    onclick : function (info) {
      console.log('menu item clicked')
        let queryText = info.selectionText;
        if (!queryText){
          queryText=info.linkText;
        }
        browser.tabs.create({
          url:`https://www.google.com/search?q=${queryText}`
        });
    }
});

// Copy the link text to the clipboard when the menu entry is clicked
browser.menus.onClicked.addListener(info => {
  if(!info.linkText) {
      return;
  }

  navigator.clipboard.writeText(info.linkText);
});


// Will update the menu entry title of hide it if title is null
function updateMenu(title) {
  let update = {
      visible: false
  };

  if(title != null) {
      if(title.length > 25) {
          // TODO: Make limit configurable
          title = title.slice(0, 22) + "...";
      }
      
      update = {
          // Escape & by doubling it to avoid access keys being generated.
          // Note that %s sill causes selected content being interpolated,
          // which cannot be prevented currently.
          title: `Search MDA for "${title.replace(/&/g, "&&")}"`,
          visible: true
      };
  }

  browser.menus.update(MENU_ID, update);
  browser.menus.refresh();
}


// Decide if and what to show when the menu entry is displayed
browser.menus.onShown.addListener(info => {
  // linkText defaults to linkUrl if the link contains no text.
  // Hide copy menu entry in this case (the user can just copy
  // the link address).
  console.dir(info)
  if(info.linkText && info.linkText != info.linkUrl) {
    //if info is link get text and update context menu
      updateMenu(info.linkText);
  }else if (info.selectionText){
    //else if highlighted text
    updateMenu(info.selectionText);
  } else {
    //elese delete item from menu
      updateMenu(null);
  }
});