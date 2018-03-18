function getAcceptedLanguage() {
  const gettingAcceptLanguages = browser.i18n.getAcceptLanguages();
  gettingAcceptLanguages.then(languages => { 
    let preferred;
    for (const language of languages) {
      let match = /(\w+)(:?-\w+)?/.exec(language);   
      if (match && match.length && SUPPORTED_LANGUAGES.indexOf(match[1]) >= 0) {
        preferred = match[1];
        break;
      }
    }
    setUpOptionsPage(preferred);
  }, () => setUpOptionsPage());  
}

function setUpOptionsPage(acceptedLanguage) {

  function setCurrentSource(result) {
    const sourceLanguage = result.wrSourceLanguage || (defaultLanguage !== DEFAULT_SOURCE ? DEFAULT_SOURCE : DEFAULT_SOURCE_FALLBACK);
    loadOptions(SOURCE, sourceLanguage);
  }

  function setCurrentTarget(result) {
    const targetLanguage = result.wrTargetLanguage || defaultLanguage;
    loadOptions(TARGET, targetLanguage);
  }

  function setKeyTranslateStatus(result) {
    const defaultValue = false;
    const enabled = result.wrKeyTranslateEnabled || defaultValue;
    document.getElementById("enableKeyTranslate").checked = enabled;
  }

  function onSourceError(error) {
    console.log(`Error: ${error}`);
    loadOptions(SOURCE, defaultLanguage !== DEFAULT_SOURCE ? DEFAULT_SOURCE : DEFAULT_SOURCE_FALLBACK);
  }

  function onTargetError(error) {
    console.log(`Error: ${error}`);
    loadOptions(TARGET, defaultLanguage);
  }

  function onKeyTranslateError(error) {
    console.log(`Error: ${error}`);
    document.getElementById("enableKeyTranslate").checked = false;
  }

  defaultLanguage = acceptedLanguage || "en";
  allOptions = Object.keys(LANGUAGE_DATA).map(createOption);
  const DEFAULT_SOURCE = "es";
  const DEFAULT_SOURCE_FALLBACK = "en";

  sourceCombo = document.getElementById("source-language");
  targetCombo = document.getElementById("target-language");
  sourceCombo.addEventListener('change', event => loadOptions(SOURCE, event.target.value));
  targetCombo.addEventListener('change', event => loadOptions(TARGET, event.target.value));

  const gettingSourceLanguage = browser.storage.local.get("wrSourceLanguage");
  gettingSourceLanguage.then(setCurrentSource, onSourceError);

  const gettingTargetLanguage = browser.storage.local.get("wrTargetLanguage");
  gettingTargetLanguage.then(setCurrentTarget, onTargetError);

  const gettingKeyTranslateEnabled = browser.storage.local.get("wrKeyTranslateEnabled");
  gettingKeyTranslateEnabled.then(setKeyTranslateStatus, onKeyTranslateError);

  const titleLabel = document.getElementById("options-title");
  titleLabel.innerText = LANGUAGE_DATA[defaultLanguage].messages["selectLanguagesToTranslate"];

  const enableKeyTranslateLabel = document.getElementById("enableKeyTranslateLabel");
  enableKeyTranslateLabel.innerText = LANGUAGE_DATA[defaultLanguage].messages["useKey"];
}

function saveOptions(event) {
  event.preventDefault();
  browser.storage.local.set({
    wrSourceLanguage: document.getElementById("source-language").value,
    wrTargetLanguage: document.getElementById("target-language").value,
    wrKeyTranslateEnabled: document.getElementById("enableKeyTranslate").checked
  });
  // Reload app after saving the new settings
  browser.runtime.reload();
  // Refresh tab to avoid crazy HTML duplicate
  browser.tabs.reload();
}

function loadOptions(option, languageKey) {
  const currentSource = sourceCombo.value;
  const currentTarget = targetCombo.value;
  cleanUpOptions(sourceCombo);
  cleanUpOptions(targetCombo);
  
  switch (option) {
    case SOURCE:
      fillCombos(targetCombo, sourceCombo, currentTarget, languageKey);      
      break;
    case TARGET:
      fillCombos(sourceCombo, targetCombo, currentSource, languageKey);
      break;
  }
}

function fillCombos(selectionCombo, fillAllCombo, currentValue, languageKey) {
  // TODO: Order options
  for (const fillAllOption of allOptions) {
    fillAllCombo.appendChild(fillAllOption);
  }      
  for (const option of LANGUAGE_DATA[languageKey].allowedTranslations) {        
    selectionCombo.appendChild(createOption(option));
  }
  fillAllCombo.value = languageKey;
  const currentIndex = LANGUAGE_DATA[languageKey].allowedTranslations.indexOf(currentValue);
  selectionCombo.value = currentIndex > 0 ? LANGUAGE_DATA[languageKey].allowedTranslations[currentIndex] : LANGUAGE_DATA[languageKey].allowedTranslations[0];
}

function createOption(language) {
  let newOption = document.createElement("option");
  newOption.value = language;
  newOption.innerText = LANGUAGE_DATA[defaultLanguage].messages[language];
  return newOption;
}

function cleanUpOptions(combo) {
  while (combo.firstChild) {
    combo.removeChild(combo.firstChild);
  }
}

document.querySelector("form").addEventListener("submit", saveOptions);
document.addEventListener("DOMContentLoaded", getAcceptedLanguage);

const SOURCE = 0;
const TARGET = 1;
let defaultLanguage;
let sourceCombo;
let targetCombo;
let allOptions;

const SUPPORTED_LANGUAGES = ['es', 'en', 'pt', 'fr', 'it'];

const LANGUAGE_DATA = {
  'en': {
    'allowedTranslations': ['es', 'pt', 'fr', 'it'],
    'messages': {
      'selectLanguagesToTranslate': 'Select the languages to translate:',  
      'en': 'English',  
      'es': 'Spanish',  
      'pt': 'Portuguese',
      'fr': 'French',
      'it': 'Italian',
      'useKey': 'Use "T" key to translate selected text'
    }
  },

  'es': {
    'allowedTranslations': ['en', 'pt', 'fr', 'it'],
    'messages': {
      'selectLanguagesToTranslate': 'Seleccione los lenguajes a traducir:',  
      'en': 'Inglés',  
      'es': 'Español',  
      'pt': 'Portugués',
      'fr': 'Francés',
      'it': 'Italiano',
      'useKey': 'Usar la tecla "T" para traducir texto seleccionado'
    }
  },

  'pt': {
    'allowedTranslations': ['en', 'es'],
    'messages': {
        'selectLanguagesToTranslate': 'Selecione os idiomas a serem traduzidos:',  
        'en': 'Inglês',  
        'es': 'Espanhol',  
        'pt': 'Português',
        'fr': 'Francês',
        'it': 'Italiano',
        'useKey': 'Use a tecla "T" para traduzir o texto selecionado'
    }
  },

  'fr': {
    'allowedTranslations': ['en', 'es'],
    'messages': {
        'selectLanguagesToTranslate': 'Sélectionnez les langues à traduire:',  
        'en': 'Anglais',  
        'es': 'Espanol',  
        'pt': 'Portugais',
        'fr': 'Français',
        'it': 'Italien',
        'useKey': 'Utilisez le touche "T" pour traduire le texte sélectionné'
    }
  },

  'it': {
    'allowedTranslations': ['en', 'es'],
    'messages': {
        'selectLanguagesToTranslate': 'Seleziona le lingue da tradurre:',  
        'en': 'Inglese',
        'es': 'Spagnolo',
        'pt': 'Portoghese',
        'fr': 'Francese',
        'it': 'Italiano',
        'useKey': 'Utilizzare il tasto "T" per tradurre il testo selezionato'
    }
  }
};