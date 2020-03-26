// Put all the javascript code here, that you want to execute in background.
"use strict";

const MENU_ID = "search_element"
const BROWSER_MENU_ID="MDA_BROWSER_MENU";
var extractedText;

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
  
//   browser.menus.create({
//     id:MENU_ID,
//     title   : 'Search MDA1 for "%s"',
//     contexts:["all"],
// },onCreated);

browser.menus.create({
  id: "search_element",
  title: 'Search MDA for "%s"',
  contexts: ["all"],
});

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case MENU_ID:
      searchForText(info)
      break;
    // case "remove-me":
    //   var removing = browser.menus.remove(info.menuItemId);
    //   removing.then(onRemoved, onError);
    //   break;
    // case "bluify":
    //   borderify(tab.id, blue);
    //   break;
    // case "greenify":
    //   borderify(tab.id, green);
    //   break;
    // case "check-uncheck":
    //   updateCheckUncheck();
    //   break;
    // case "open-sidebar":
    //   console.log("Opening my sidebar");
    //   break;
    // case "tools-menu":
    //   console.log("Clicked the tools menu item");
    //   break;
  }
});

function searchForText(info) {
  console.dir('search for:'+info)
    let queryText = info.linkText;
    if (!queryText){
      queryText=info.selectionText;
    }

    if (!queryText){
      queryText=extractedText;
      extractedText=null;
    }

    browser.tabs.create({
      url:`https://www.google.com/search?q=${queryText}`
    });
}


// Will update the menu entry title of hide it if title is null
function updateMenu(id , title) {
  let update = {
      visible: false
  };

  console.log('update menue:'+title)
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

  browser.menus.update(id, update);
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
    console.log('call 1')
      updateMenu(MENU_ID,info.linkText);
  }else if (info.selectionText){
    //else if highlighted text
    console.log('call 2')
    updateMenu(MENU_ID,info.selectionText);
  } else if (!extractedText) {
    //elese delete item from menu
    console.log('call 3')
      updateMenu(MENU_ID,null);
  }
});

function handleMessage(request, sender, sendResponse) {
  console.log("Extracted text:" +
    request.greeting);
    extractedText=request.greeting;
    updateMenu(MENU_ID , request.greeting)

  // sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage); 