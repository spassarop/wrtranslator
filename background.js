/*
*   Navigation bar button
*/
function openWordReference(url) {
    chrome.tabs.create({
        "url": (typeof url === "string" ? url : "http://www.wordreference.com/")
    });
}

chrome.browserAction.onClicked.addListener(openWordReference);

/*
*   Context menu
*/
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "wr-settings":
            chrome.runtime.openOptionsPage();
            break;
        case "wr-translate":
            chrome.tabs.sendMessage(tab.id, {
                "selectedText": info.selectionText.trim() 
            }, 
            response => openWordReference(response));
            break;
    }
});

function buildContextMenu(message) {
    let messages = message.messages;
    chrome.contextMenus.create({
        id: "wr-translate",
        title: messages.translate,
        contexts: ["selection"]
    });
    
    chrome.contextMenus.create({
        id: "separator-1",
        type: "separator",
        contexts: ["selection"]
      });
    
    chrome.contextMenus.create({
        id: "wr-settings",
        title: messages.openSettings,
        contexts: ["all"]
    });
}

chrome.runtime.onMessage.addListener(buildContextMenu);
