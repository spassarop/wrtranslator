/*
*   Navigation bar button
*/
function openWordReference(url) {
    browser.tabs.create({
        "url": (typeof url === "string" ? url : "http://www.wordreference.com/")
    });
}

browser.browserAction.onClicked.addListener(openWordReference);

/*
*   Context menu
*/
browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "wr-settings":
            browser.runtime.openOptionsPage();
            break;
        case "wr-translate":
            browser.tabs.sendMessage(tab.id, {
                "selectedText": info.selectionText.trim() 
            }).then(response => openWordReference(response.url));
            break;
    }
});

function buildContextMenu(message) {
    let messages = message.messages;
    browser.menus.create({
        id: "wr-translate",
        title: messages.translate,
        contexts: ["selection"]
    });
    
    browser.menus.create({
        id: "separator-1",
        type: "separator",
        contexts: ["selection"]
      });
    
    browser.menus.create({
        id: "wr-settings",
        title: messages.openSettings,
        contexts: ["all"]
    });
}

browser.runtime.onMessage.addListener(buildContextMenu);
