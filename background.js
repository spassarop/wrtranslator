function openWordReference() {
    browser.tabs.create({
        "url": "http://www.wordreference.com/"
    });
}

browser.browserAction.onClicked.addListener(openWordReference);