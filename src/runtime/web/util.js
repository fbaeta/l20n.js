// A document.ready shim
// https://github.com/whatwg/html/issues/127
export function documentReady() {
  if (document.readyState !== 'loading') {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    document.addEventListener('readystatechange', function onrsc() {
      document.removeEventListener('readystatechange', onrsc);
      resolve();
    });
  });
}

export function getResourceLinks(head) {
  return Array.prototype.map.call(
    head.querySelectorAll('link[rel="localization"]'),
    el => [el.getAttribute('href'), el.getAttribute('name') || 'main']
  ).reduce(
    (seq, [href, name]) => seq.set(name, (seq.get(name) || []).concat(href)),
    new Map()
  );
}

export function getMeta(head) {
  let availableLangs = new Set();
  let defaultLang = null;
  let appVersion = null;

  // XXX take last found instead of first?
  const metas = Array.from(head.querySelectorAll(
    'meta[name="availableLanguages"],' +
    'meta[name="defaultLanguage"],' +
    'meta[name="appVersion"]')
  );
  for (const meta of metas) {
    const name = meta.getAttribute('name');
    const content = meta.getAttribute('content').trim();
    switch (name) {
      case 'availableLanguages':
        availableLangs = new Set(content.split(',').map(lang => {
          return lang.trim();
        }));
        break;
      case 'defaultLanguage':
        defaultLang = content;
        break;
      case 'appVersion':
        appVersion = content;
    }
  }

  return {
    defaultLang,
    availableLangs,
    appVersion
  };
}
