console.log('hello depuis main');
const technosDiv = document.querySelector('#technos');

function loadTechnologies() {
  fetch('http://localhost:3001/technos')  // fetch sur json-server
    .then(response => {
      response.json()
        .then(technos => {
          const allTechnos = technos.map(t => `<div><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`)
            .join('');

          technosDiv.innerHTML = allTechnos;
        });
    })
    .catch(console.error);
}
loadTechnologies();

// Mise en place du Service Worker
// On verifie d'abord que le navigateur prend en charge 'Service Worker'
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js')  // Initialisation du SW qui renvoie une promise
    .catch(err => console.error)
}

// Mise en place du cache - On verifie la prise en charge
// if (window.caches) {
//   caches.open('veille-tecno-1.0')   // et on nome un nouveau cache
//     .then(cache => {
//       cache.addAll([                // pour y stocker les elements importants pour le rendu
//         'index.html',
//         'main.js',
//         'vendors/bootstrap4.min.css'
//       ])
//     })
//   caches.open('another-cache-1.0')  // un deuxieme pour l'exemple suivant (keys)
//   caches.keys().then(console.log)   // la promise renvoie la liste des caches
// }