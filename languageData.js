export const SUPPORTED_LANGUAGES = ['es', 'en-US', 'pt'];

export const LANGUAGE_DATA = {
  'en-US': {
    'allowedTranslations': [
      'es',
      'pt_BR'
    ],
    'partialPath': {
      'es': 'es/translation.asp?tranword=',
      'pt_BR': 'enpt/'
    },
    'messages': {
      'translate': {
          'message': 'Translate'
      },  
      'selectLanguagesToTranslate': {
          'message': 'Select the languages to translate:'
      },  
      'en-US': {
          'message': 'English'
      },  
      'es': {
          'message': 'Spanish'
      },  
      'pt_BR': {
          'message': 'Portuguese'
      }
    }
  },

  'es': {
    'allowedTranslations': [
      'en-US',
      'pt_BR'
    ],
    'partialPath': {
      'en-US': 'es/en/translation.asp?spen=',
      'pt_BR': 'espt/'
    },
    'messages': {
      'translate': {
          'message': 'Traducir'
      },  
      'selectLanguagesToTranslate': {
          'message': 'Seleccione los lenguajes a traducir:'
      },  
      'en-US': {
          'message': 'Inglés'
      },  
      'es': {
          'message': 'Español'
      },  
      'pt_BR': {
          'message': 'Portugués'
      }
    }
  },

  'pt_BR': {
    'allowedTranslations': [
      'en-US',
      'es'
    ],
    'partialPath': {
      'en-US': 'pten/',
      'es': 'ptes/',
    },
    'messages': {
      'translate': {
          'message': 'Traduzir'
      },  
      'selectLanguagesToTranslate': {
          'message': 'Selecione os idiomas a serem traduzidos:'
      },  
      'en-US': {
          'message': 'Inglês'
      },  
      'es': {
          'message': 'Espanhol'
      },  
      'pt_BR': {
          'message': 'Português'
      }
    }
  }
};