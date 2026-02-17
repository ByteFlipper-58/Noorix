const scheduledNotificationTimers = new Map();
const SW_NOTIFICATION_TYPE = 'SCHEDULE_PRAYER_NOTIFICATION';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const buildNotificationOptions = (payload) => ({
  body: payload.body,
  icon: payload.icon || '/favicon.svg',
  badge: payload.badge || '/favicon.svg',
  tag: payload.tag,
  renotify: false,
  data: {
    url: payload.url || '/'
  }
});

const showNotificationNow = async (payload) => {
  await self.registration.showNotification(payload.title, buildNotificationOptions(payload));
};

const scheduleWithTimeout = (payload) => {
  const existingTimer = scheduledNotificationTimers.get(payload.tag);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const delay = payload.scheduledTime - Date.now();
  if (delay <= 0) {
    void showNotificationNow(payload);
    return;
  }

  const timer = setTimeout(async () => {
    scheduledNotificationTimers.delete(payload.tag);
    await showNotificationNow(payload);
  }, delay);

  scheduledNotificationTimers.set(payload.tag, timer);
};

const scheduleNotification = async (payload) => {
  if (!payload || typeof payload.scheduledTime !== 'number' || !payload.title) {
    return;
  }

  if (payload.scheduledTime <= Date.now()) {
    await showNotificationNow(payload);
    return;
  }

  if (typeof self.TimestampTrigger === 'function') {
    const options = buildNotificationOptions(payload);
    options.showTrigger = new self.TimestampTrigger(payload.scheduledTime);
    await self.registration.showNotification(payload.title, options);
    return;
  }

  scheduleWithTimeout(payload);
};

self.addEventListener('message', (event) => {
  const message = event.data;
  if (!message || message.type !== SW_NOTIFICATION_TYPE) {
    return;
  }

  event.waitUntil(scheduleNotification(message.payload));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const matchedClient = clients.find((client) => {
        return client.url.includes(targetUrl) || targetUrl === '/';
      });

      if (matchedClient) {
        return matchedClient.focus();
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
