function getAcceptedLanguage() {
  const gettingAcceptLanguages = browser.i18n.getAcceptLanguages();
  gettingAcceptLanguages.then((languages) => { 
    let preferred;
    for (const language of languages) {
      if (SUPPORTED_LANGUAGES.indexOf(language) >= 0) {
        preferred = language;
        break;
      }
    }
    setUpOptionsPage(preferred);
  }, () => { setUpOptionsPage() });  
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

  function onSourceError(error) {
    console.log(`Error: ${error}`);
    loadOptions(SOURCE, defaultLanguage !== DEFAULT_SOURCE ? DEFAULT_SOURCE : DEFAULT_SOURCE_FALLBACK);
  }

  function onTargetError(error) {
    console.log(`Error: ${error}`);
    loadOptions(TARGET, defaultLanguage);
  }

  defaultLanguage = acceptedLanguage || "en-US";
  allOptions = Object.keys(LANGUAGE_DATA).map(createOption);
  const DEFAULT_SOURCE = "es";
  const DEFAULT_SOURCE_FALLBACK = "en-US";

  sourceCombo = document.getElementById("source-language");
  targetCombo = document.getElementById("target-language");
  sourceCombo.addEventListener('change', (event) => {
    loadOptions(SOURCE, event.target.value);
  });
  targetCombo.addEventListener('change', (event) => {
    loadOptions(TARGET, event.target.value);
  });

  let gettingSourceLanguage = browser.storage.local.get("wrSourceLanguage");
  gettingSourceLanguage.then(setCurrentSource, onSourceError);

  let gettingTargetLanguage = browser.storage.local.get("wrTargetLanguage");
  gettingTargetLanguage.then(setCurrentTarget, onTargetError);

  const titleLabel = document.getElementById("options-title");
  titleLabel.innerText = LANGUAGE_DATA[defaultLanguage].messages["selectLanguagesToTranslate"];
}

function saveOptions(event) {
  event.preventDefault();
  browser.storage.local.set({
    wrSourceLanguage: document.getElementById("source-language").value,
    wrTargetLanguage: document.getElementById("target-language").value
  });
  // TODO: Alert save success
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

const SUPPORTED_LANGUAGES = ['es', 'en-US', 'pt'];

const LANGUAGE_DATA = {
  'en-US': {
    'allowedTranslations': [
      'es',
      'pt_BR'
    ],
    'messages': {
      'selectLanguagesToTranslate': 'Select the languages to translate:',  
      'en-US': 'English',  
      'es': 'Spanish',  
      'pt_BR': 'Portuguese'
    }
  },

  'es': {
    'allowedTranslations': [
      'en-US',
      'pt_BR'
    ],
    'messages': {
      'selectLanguagesToTranslate': 'Seleccione los lenguajes a traducir:',  
      'en-US': 'Inglés',  
      'es': 'Español',  
      'pt_BR': 'Portugués'
    }
  },

  'pt_BR': {
    'allowedTranslations': [
      'en-US',
      'es'
    ],
    'messages': {
        'selectLanguagesToTranslate': 'Selecione os idiomas a serem traduzidos:',  
        'en-US': 'Inglês',  
        'es': 'Espanhol',  
        'pt_BR': 'Português'
    }
  }
};