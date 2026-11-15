// Работа без интернета: при установке все файлы приложения сохраняются на устройстве.
// ПРИ КАЖДОЙ ВЫКЛАДКЕ ПОВЫШАЙ НОМЕР ВЕРСИИ, иначе телефон будет показывать старую версию.
var VERSION = 10;

var PREFIX = "skazhu-za-vas-v";
var CACHE = PREFIX + VERSION;

var FILES = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "lesson.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/spina.svg",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(FILES.map(function (file) {
        return new Request(file, { cache: "reload" });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.indexOf(PREFIX) === 0 && name !== CACHE;
      }).map(function (name) { return caches.delete(name); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (hit) {
      return hit || fetch(event.request);
    })
  );
});
