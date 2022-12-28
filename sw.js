/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */

'use strict';

/* eslint-disable max-len */

const applicationServerPublicKey = 'BH8-hIchXKMI6AKSee8gD0hhPThRqaEhIEtMJwcTjEQhiOKdG-_2tTIO-6hOAK4kwg5M9Saedjxp4hVE-khhWxY';

/* eslint-enable max-len */

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Modular Mindfulness';
  const options = {
    body: 'You have a notification!',
    icon: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_red_icon_156942.png',
    badge: 'https://cdn.icon-icons.com/icons2/2620/PNG/512/among_us_player_red_icon_156942.png',
    actions: [
      {
        action: 'view-action',
        title: 'View',
        type: 'button'
      },
      {
        action: 'ignore-action',
        title: 'Ignore',
        type: 'button'
      }
    ],
  };

  registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  if (!event.action) {
    // Was a normal notification click
    console.log('Notification Click.');
    return;
  }

  switch (event.action) {
    case 'view-action':
      event.notification.close();
      clients.openWindow('https://developers.google.com/web/');
      console.log('App Opened');
      break;
    case 'ignore-action':
      event.notification.close();
      console.log("Ignored");
      break;
  }
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      // TODO: Send to application server
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
});
