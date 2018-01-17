/**
 * Check and set a global guard variable.
 * If this content script is injected into the same page again,
 * it will do nothing next time.
 */
// if (window.hasRun) {
//   return;
// }
// window.hasRun = true;

const DEFAULT_TRANSLATE_TEXT = "translate"; // TODO: Make sure English works to use capital letter.

function showFloatingLink (event) {
  let selectedText = window.getSelection().toString().trim();
  if (selectedText !== "") {
    // Double click was with in a HTML document
    if (event.target.ownerDocument.body !== null) {
                
      // Save a reference to the body the floating link is in (could be N tabs)
      let currentPageBody = event.target.ownerDocument.body;
      let translateDiv = document.getElementById("wrtranslator-container");
      let translateLink = document.getElementById("wrtranslator-link");

      if (translateDiv === null || translateLink === null) {
        translateDiv = document.createElement("div");
        translateDiv.id = "wrtranslator-container";
        
        translateLink = document.createElement("a");
        translateLink.id = "wrtranslator-link";
        translateLink.target = "_blank";
        translateLink.textContent = browser.i18n.getMessage("translate") || DEFAULT_TRANSLATE_TEXT;

        translateDiv.appendChild(translateLink);
        currentPageBody.appendChild(translateDiv);
      }
      
      translateDiv.style.top = `${event.clientY}px`;
      translateDiv.style.left = `${event.clientX}px`;
      translateLink.href = getTranslationUrl(selectedText);
      // browser.runtime.sendMessage();
    }
  }
}

function getTranslationUrl(selectedText) {
  return `http://www.wordreference.com/es/translation.asp?tranword=${selectedText}`;
}

function closeFloatingLink() {
  let translateDiv = document.getElementById("wrtranslator-container");
  translateDiv.remove();  
}

function attemptClosing(event) {
  if (event.target.id !== 'wrtranslator-container' && event.target.id !== 'wrtranslator-link') {
    closeFloatingLink();
  }
}

window.addEventListener("dblclick", showFloatingLink);
window.addEventListener("click", closeFloatingLink);
// browser.runtime.onMessage.addListener(closeFloatingLink);
