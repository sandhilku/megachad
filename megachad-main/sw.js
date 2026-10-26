const CACHE = 'megachad-v4-autotick';
const ASSETS = ['./','./index.html','./app.js','./custom.css','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>(k.startsWith('megachad-')||k==='workout-tracker-v1')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request);
      if(response.ok)await cache.put(event.request,response.clone());
      return response;
    }catch{
      return await cache.match(event.request) || (event.request.mode==='navigate'?await cache.match('./index.html'):null) || new Response('Offline resource unavailable',{status:503});
    }
  })());
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();event.waitUntil((async()=>{
    for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true}))if(client.url.startsWith(self.registration.scope)&&'focus'in client)return client.focus();
    return self.clients.openWindow(new URL('index.html',self.registration.scope).href);
  })());
});
