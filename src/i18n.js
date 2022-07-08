import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import LastUsed from 'locize-lastused';
import { locizePlugin } from 'locize';



const locizeOptions = {
  projectId: 'd5e1f6f0-ac58-4b66-9361-01675428eea4',
  apiKey: '70f438ab-d9cd-4910-b97d-50abf0bbea22', // YOU should not expose your apps API key to production!!!
  referenceLng: 'en',
};


const options={
  // order and from where user language should be detected
  order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // optional expire and domain for set cookie
  cookieMinutes: 10,
  cookieDomain: 'myDomain',

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,

  // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
  cookieOptions: { path: '/', sameSite: 'strict' }
}

const fallbackLng = ['en']; 

const availableLanguages=['en'];

i18n
  .use(Backend)
  .use(LastUsed)
  .use(locizePlugin)
  .use(LanguageDetector)
  .use(initReactI18next) // pass i18 down to react-i18next 
  .init({    
    fallbackLng,
    saveMissing: true,
    whitelist: availableLanguages, 
    detection: options,   
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: locizeOptions,
    locizeLastUsed: locizeOptions,
  });


export default i18n;