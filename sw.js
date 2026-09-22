/* דוח אחד, Service Worker להתראות פוש */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e){ data = { title:'דוח אחד', body: (event.data && event.data.text()) || '' }; }
  var title = data.title || 'דוח אחד';
  var opts = {
    body: data.body || '',
    dir: 'rtl',
    lang: 'he',
    tag: data.tag || ('dohehad-'+Date.now()),
    renotify: true,
    requireInteraction: true,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(function(list){
      for (var i=0;i<list.length;i++){ if('focus' in list[i]) return list[i].focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
