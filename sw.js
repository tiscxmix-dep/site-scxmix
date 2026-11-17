/* SCX Mix — service worker: permite instalar como app e abrir mesmo sem internet.
   Sempre tenta a versão mais nova da rede primeiro; o cache só entra se estiver offline.
   Desenvolvido por CRG - Soluções Tecnológicas */
const CACHE = "scx-v1";
const BASE = ["./", "index.html", "admin.html", "config.js", "assets/comum.js", "assets/logo.png", "assets/favicon.png", "assets/icon-192.png", "assets/painel-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return; // Supabase e CDNs: direto na rede
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined)))
  );
});
