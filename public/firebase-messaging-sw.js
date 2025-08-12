// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase 설정 (실제 프로젝트 설정으로 교체 필요)
firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
});

const messaging = firebase.messaging();

// 백그라운드 메시지 핸들러
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // 알림 데이터 추출
  const notificationTitle = payload.notification?.title || 'WeHand 알림';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 알림이 있습니다.',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: payload.data?.tag || 'wehand-notification',
    data: payload.data || {},
    actions: []
  };

  // 알림 타입에 따른 액션 추가
  if (payload.data?.type === 'chat') {
    notificationOptions.actions = [
      { action: 'reply', title: '답장', icon: '/icons/reply.png' },
      { action: 'view', title: '보기', icon: '/icons/view.png' }
    ];
  } else if (payload.data?.type === 'match') {
    notificationOptions.actions = [
      { action: 'accept', title: '수락', icon: '/icons/accept.png' },
      { action: 'decline', title: '거절', icon: '/icons/decline.png' }
    ];
  }

  // 진동 패턴 추가 (모바일)
  notificationOptions.vibrate = [200, 100, 200];

  // 알림 표시
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 핸들러
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();

  // 알림 데이터에서 URL 추출
  const urlToOpen = event.notification.data?.url || '/';
  
  // 액션에 따른 처리
  if (event.action === 'reply') {
    // 빠른 답장 기능 (추후 구현)
    console.log('Reply action clicked');
  } else if (event.action === 'view' || event.action === 'accept') {
    // 해당 페이지로 이동
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // 이미 열려있는 탭이 있으면 포커스
          for (let client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // 없으면 새 탭 열기
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  } else if (event.action === 'decline') {
    // 거절 처리 (API 호출 등)
    console.log('Decline action clicked');
  } else {
    // 기본 동작: 앱 열기 또는 포커스
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // 이미 열려있는 앱이 있으면 포커스
          if (windowClients.length > 0) {
            return windowClients[0].focus();
          }
          // 없으면 새로 열기
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// 알림 닫기 핸들러
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification was closed', event);
  // 통계 수집 등 추가 작업 가능
});