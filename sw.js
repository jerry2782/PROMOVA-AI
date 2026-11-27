const CACHE="promova-ai-v1-10";
const ASSETS=["./","./index.html","./styles.css?v=1.2.1","./app.js?v=1.2.1","./manifest.webmanifest","./assets/icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 const isAppAsset=url.origin===self.location.origin&&(/\.(?:html|css|js)$/.test(url.pathname)||e.request.mode==="navigate");
 if(isAppAsset){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(response=>{
   if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy));}
   return response;
  }).catch(()=>caches.match(e.request).then(cached=>cached||caches.match("./index.html"))));
  return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{
  if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy));}
  return response;
 }).catch(()=>caches.match("./index.html"))));
});
