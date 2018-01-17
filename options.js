// TODO: Get both language options and block target language based on source language.
function saveOptions(event) {
    event.preventDefault();
    browser.storage.local.set({
      language: document.querySelector("#language").value
    });
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.querySelector("#language").value = result.language || browser.i18n.getUILanguage();
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    var getting = browser.storage.local.get("language");
    getting.then(setCurrentChoice, onError);
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);