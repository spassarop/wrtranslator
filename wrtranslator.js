(function () {
  const debug = false;

  function showFloatingLink (event) {
    const Y_LIMMIT = 60;
    const placeOnTop = event.clientY > Y_LIMMIT;
    const TOP_OFFSET = placeOnTop ? 65 : 17;
    const LEFT_OFFSET = 40;
    const selectedText = window.getSelection().toString().trim();
    if (selectedText !== "") {
      // Double click was with in a HTML document
      if (event.target.ownerDocument.body !== null) {
                  
        const currentPageBody = event.target.ownerDocument.body;
        let translateDiv = document.getElementById("wrtranslator-container");
        let translateLink = document.getElementById("wrtranslator-link");

        if (translateDiv === null || translateLink === null) {
          translateDiv = document.createElement("div");
          translateDiv.id = "wrtranslator-container";
          
          translateLink = document.createElement("a");
          translateLink.id = "wrtranslator-link";
          translateLink.target = "_blank";
          translateLink.textContent = LANGUAGE_DATA[targetLanguage].messages.translate;

          translateDiv.appendChild(translateLink);
          currentPageBody.appendChild(translateDiv);
        }
        
        const topPosition = placeOnTop ? event.clientY - TOP_OFFSET : event.clientY + TOP_OFFSET;
        translateDiv.classList = placeOnTop ? "onTop" : "onBottom";
        translateDiv.style.top = `${topPosition}px`;
        translateDiv.style.left = `${event.clientX - LEFT_OFFSET}px`;
        translateLink.href = getTranslationUrl(selectedText);
      }
    }
  }

  function loadConfiguration() {
    const DEFAULT_SOURCE = "es";
    const DEFAULT_TARGET = "en";
    const gettingSourceLanguage = browser.storage.local.get("wrSourceLanguage");
    gettingSourceLanguage.then(setCurrentSource, loadDefaults);

    function setCurrentSource(result) {
      const loadedSource = result.wrSourceLanguage;
      if (!loadedSource) {
        loadDefaults();
      } else {
        sourceLanguage = loadedSource;
        const gettingTargetLanguage = browser.storage.local.get("wrTargetLanguage");
        gettingTargetLanguage.then(setCurrentTarget, loadDefaults);
      }
    }

    function setCurrentTarget(result) {
      const loadedTarget = result.wrTargetLanguage;
      if (!loadedTarget) {
        loadDefaults();
      } else {
        targetLanguage = loadedTarget;
        loadEnabledTranslateKey();
      }
    }

    function loadDefaults() {
      sourceLanguage = DEFAULT_SOURCE;
      targetLanguage = DEFAULT_TARGET;
      loadEnabledTranslateKey();
    }  

    function loadEnabledTranslateKey() {
      const gettingEnabledKeyStatus = browser.storage.local.get("wrKeyTranslateEnabled");
      gettingEnabledKeyStatus.then((result) => {
        const defaultValue = false;
        const enabled = result.wrKeyTranslateEnabled || defaultValue;
        addEventListeners(enabled);
      }, () => addEventListeners());
    } 

    function addEventListeners(translateKeyEnabled) {
      window.addEventListener("dblclick", showFloatingLink);
      window.addEventListener("click", attemptClosing);
      if (translateKeyEnabled) window.addEventListener("keypress", onTranslationKeyPressed);
      browser.runtime.sendMessage({ 
        messages: LANGUAGE_DATA[targetLanguage].messages
      });
      if (debug) console.log(`Events attached. Source language: ${sourceLanguage}. Target language: ${targetLanguage}.`);
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

  function onTranslationKeyPressed(event) {
    const keyCode = 'KeyT';
    if(event.code === keyCode) {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText !== "") {
        const url = getTranslationUrl(selectedText);
        const newTab = window.open(url, '_blank');
        if (newTab) {
          //Browser has allowed it to be opened
          newTab.focus();
        }
      }
    }
  }

  function translateInNewTab(message) {
    return Promise.resolve({ url: getTranslationUrl(message.selectedText) });
  }

  let sourceLanguage;
  let targetLanguage;
  loadConfiguration();

  browser.runtime.onMessage.addListener(translateInNewTab);

  const LANGUAGE_DATA = {
    'en': {
      'partialPath': {
        'es': 'es/translation.asp?tranword=',
        'pt': 'enpt/',
        'fr': 'enfr/',
        'it': 'enit/',
        'de': 'ende/'
      },
      'messages': {
        'translate': 'Translate',
        'openSettings': 'WordReference Translator settings'
      }
    },

    'es': {
      'partialPath': {
        'en': 'es/en/translation.asp?spen=',
        'pt': 'espt/',
        'fr': 'esfr/',
        'it': 'esit/',
        'de': 'esde/'
      },
      'messages': {
        'translate': 'Traducir',
        'openSettings': 'Configuración de WordReference Translator'
      }
    },

    'pt': {
      'partialPath': {
        'en': 'pten/',
        'es': 'ptes/'
      },
      'messages': {
          'translate': 'Traduzir',
          'openSettings': 'Configuração do WordReference Translator'
      }
    },

    'fr': {
      'partialPath': {
        'en': 'fren/',
        'es': 'fres/'
      },
      'messages': {
          'translate': 'Traduire',
          'openSettings': 'Paramètres du WordReference Translator'
      }
    },

    'it': {
      'partialPath': {
        'en': 'iten/',
        'es': 'ites/'
      },
      'messages': {
          'translate': 'Traduci',
          'openSettings': 'Configurazione di WordReference Translator'
      }
    },

    'de': {
      'partialPath': {
        'en': 'deen/',
        'es': 'dees/'
      },
      'messages': {
          'translate': 'Übersetzen',
          'openSettings': 'WordReference Translator Einstellungen'
      }
    }
  };

})();