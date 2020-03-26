console.log('content loaded')

var extractedText;
document.addEventListener("contextmenu", function(event){
//   if((event.altKey && metaKey == "Alt")
//       || (event.ctrlKey && metaKey == "Ctrl")
//       || (event.shiftKey && metaKey == "Shift")) { 
    extractedText =copyCommand(event.target);
    //   event.preventDefault(); if you want to prevent default behavior(not showing mneu)
    notifyBackgroundPage()

//   }
});

function copyCommand(clickedElement){
    console.log('clicked element')
    // console.dir(clickedElement)
    var text = getText(clickedElement.firstChild, "\r\n").trim();
    var numbers = text.match(/(\d+)/); 
    console.log(text)
    console.log(numbers)
    return text;
}

function getText(node, lineSeparator){
    var text = "";
    while(node != null){
        if(node.nodeType == Node.TEXT_NODE){
            text += node.nodeValue.trim();
        }else if(node.nodeType == Node.ELEMENT_NODE){
            if($(node).is(':visible')){
                var childText = ""; 
                if(node.firstChild != null){
                    if(node.parentNode.nodeName == "SELECT" && node.nodeName == "OPTION"){
                        // Get selected option text only
                        if(node.parentNode[node.parentNode.selectedIndex] == node){
                            childText = getText(node.firstChild, lineSeparator);
                        }
                    }else{
                        childText = getText(node.firstChild, lineSeparator);
                    }
                }

                if(childText != ""){
                    text += childText;
                }

                if(node.nodeName == "BR" || window.getComputedStyle(node, null).display.indexOf("inline") === -1){
                    text += lineSeparator;
                }
            }
        }

        node = node.nextSibling;
    }

    return text.trim();
}

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
  }
  
  function handleError(error) {
    console.log(`Error: ${error}`);
  }
  
  function notifyBackgroundPage() {
      console.log('text:'+extractedText)
    var sending = browser.runtime.sendMessage({
        greeting: extractedText
    });
    // sending.then(handleResponse, handleError);  
  }