console.log("Hello from Service Worker !")

const cacheName = 'veille-techno' + '1.1';

self.addEventListener('install', event => {
  console.log(`sw installé à ${new Date().toLocaleTimeString()}`);       
  const cachePromise = caches.open(cacheName).then(cache => {
      return cache.addAll([
          'index.html',
          'main.js',
          'style.css',
          'vendors/bootstrap4.min.css',
          'add_techno.html',
          'add_techno.js',
          'contact.html',
          'contact.js',
      ])
      .then(console.log('cache initialisé'))
      .catch(console.err);
  })
})

self.addEventListener('activate', event => {
  console.log('activate : ', event)
})

self.addEventListener('fetch', event => {
  if ( ! navigator.onLine ) {
    const headers = { headers: { 'content-type': 'text/html; charset=utf-8'}}
    event.respondWith( new Response('<h1>Hors connexion</h1><p>Application en mode dégradé</p>', headers))
  };

  if (event.request.url.indexOf('http') !==0) {
    console.log(`Non prise en charge ${event.request.url}`)
    return    // si la requete est étrangère (par ex : chrome-extension://.....) on skip
  }

  event.respondWith(                        // Dans tous les cas on utilise le cache
    caches.match(event.request).then(res => {   // si une requete similaire
      if (res) {                            // existe dans le cache
        console.log(`fetch depuis le cache ${event.request.url}`)
        return res                          // elle sera servie
      }
      return fetch(event.request).then(res => {   // Dans le cas contraire, on fetch
        console.log(`url ajoutée au cache ${event.request.url}`)
        caches.open(cacheName)          // et on ajoute la reponse dans le cache
          .then(cache => cache.put(event.request, res));
        return res.clone();     // sans oublier de renvoyer la reponse
      })
    })
  )
})