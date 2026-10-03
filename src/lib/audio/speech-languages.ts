export type SpeechLanguageCode = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT';

export interface SpeechLanguageOption {
  code: SpeechLanguageCode;
  label: string;
  flag: string;
  phonetics: Record<string, string>;
}

export const SPEECH_LANGUAGES: Record<SpeechLanguageCode, SpeechLanguageOption> = {
  'pt-BR': {
    code: 'pt-BR',
    label: 'Português',
    flag: '🇧🇷',
    phonetics: {
      'A': 'A',
      'B': 'Bê',
      'C': 'Cê',
      'D': 'Dê',
      'E': 'É',
      'F': 'Éfe',
      'G': 'Gê',
      'H': 'Agá',
    }
  },
  'en-US': {
    code: 'en-US',
    label: 'English',
    flag: '🇺🇸',
    phonetics: {
      'A': 'Ay',
      'B': 'Bee',
      'C': 'See',
      'D': 'Dee',
      'E': 'Ee',
      'F': 'Eff',
      'G': 'Jee',
      'H': 'Aitch',
    }
  },
  'es-ES': {
    code: 'es-ES',
    label: 'Español',
    flag: '🇪🇸',
    phonetics: {
      'A': 'A',
      'B': 'Be',
      'C': 'Ce',
      'D': 'De',
      'E': 'E',
      'F': 'Efe',
      'G': 'Ge',
      'H': 'Hache',
    }
  },
  'fr-FR': {
    code: 'fr-FR',
    label: 'Français',
    flag: '🇫🇷',
    phonetics: {
      'A': 'A',
      'B': 'Bé',
      'C': 'Cé',
      'D': 'Dé',
      'E': 'E',
      'F': 'Èfe',
      'G': 'Gé',
      'H': 'Ache',
    }
  },
  'de-DE': {
    code: 'de-DE',
    label: 'Deutsch',
    flag: '🇩🇪',
    phonetics: {
      'A': 'A',
      'B': 'Be',
      'C': 'Tse',
      'D': 'De',
      'E': 'E',
      'F': 'Eff',
      'G': 'Ge',
      'H': 'Ha',
    }
  },
  'it-IT': {
    code: 'it-IT',
    label: 'Italiano',
    flag: '🇮🇹',
    phonetics: {
      'A': 'A',
      'B': 'Bi',
      'C': 'Ci',
      'D': 'Di',
      'E': 'E',
      'F': 'Effe',
      'G': 'Gi',
      'H': 'Acca',
    }
  }
};

export function getSpeechPhonetic(letter: string, lang: SpeechLanguageCode): string {
  const config = SPEECH_LANGUAGES[lang] || SPEECH_LANGUAGES['pt-BR'];
  return config.phonetics[letter] || letter;
}
