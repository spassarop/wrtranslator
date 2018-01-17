// const TIMEOUT = 5;
// let timeLeft = 0;

function openWordReference() {
    browser.tabs.create({
        "url": "http://www.wordreference.com/"
    });
}

// Possible concurrency issues
// function timeoutFloatingLink(message) {
//     var language = browser.i18n.i18n.getUILanguage();

//     timeLeft = TIMEOUT;
    
//     if(timeLeft === 0){
//         browser.runtime.sendMessage();
//     }
// }

browser.browserAction.onClicked.addListener(openWordReference);

// Assign `timeoutFloatingLink()` as a listener to messages from the main script.
//browser.runtime.onMessage.addListener(timeoutFloatingLink);