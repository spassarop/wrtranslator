import { LANGUAGE_DATA } from 'languageData';
/**
 * Check and set a global guard variable.
 * If this content script is injected into the same page again,
 * it will do nothing next time.
 */
// if (window.hasRun) {
//   return;
// }
// window.hasRun = true;

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
        translateLink.textContent = LANGUAGE_DATA[targetLanguage].messages["translate"];

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

// TODO: Check if language loading works
function loadLanguages() {
  const DEFAULT_SOURCE = "es";
  const DEFAULT_TARGET = "en-US";
  let gettingSourceLanguage = browser.storage.local.get("wrSourceLanguage");
  gettingSourceLanguage.then(setCurrentSource, loadDefaults);

  function setCurrentSource(result) {
    const loadedSource = result.wrSourceLanguage;
    if (!loadedSource) {
      loadDefaults();
    } else {
      sourceLanguage = loadedSource;
      let gettingTargetLanguage = browser.storage.local.get("wrTargetLanguage");
      gettingTargetLanguage.then(setCurrentTarget, loadDefaults);
    }
  }

  function setCurrentTarget(result) {
    const loadedTarget = result.wrTargetLanguage;
    if (!loadedTarget) {
      loadDefaults();
    } else {
      targetLanguage = loadedTarget;
    }
  }

  function loadDefaults() {
    sourceLanguage = DEFAULT_SOURCE;
    targetLanguage = DEFAULT_TARGET;
  }  
}

function getTranslationUrl(selectedText) {
  return `http://www.wordreference.com/${LANGUAGE_DATA[sourceLanguage].partialPath[targetLanguage]}${selectedText}`;
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

let targetLanguage;
let sourceLanguage;

window.addEventListener("dblclick", showFloatingLink);
window.addEventListener("click", attemptClosing);
window.addEventListener("load", loadLanguages);
// browser.runtime.onMessage.addListener(closeFloatingLink);
