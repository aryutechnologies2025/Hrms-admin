// notifications/notificationManager.js

let audio = null;
let lastSoundTime = 0;

export const initNotificationSound = () => {

  if (!audio) {
    audio = new Audio("/notification.mp3");
    audio.preload = "auto";
  }

};

export const playSound = () => {

  // Ensure audio exists
  if (!audio) initNotificationSound();

  const now = Date.now();

  // Prevent rapid sound spam
  if (now - lastSoundTime < 500) return;

  lastSoundTime = now;

  audio.currentTime = 0;

  audio.play().catch(() => {});

};

export const requestNotificationPermission = () => {

  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {

    Notification.requestPermission();

  }

};

// export const showBrowserNotification = (title, body) => {

//   if (!("Notification" in window)) return;

//   if (Notification.permission !== "granted") return;

//   const notification = new Notification(title, {
//     body,
//     icon: "/chat-icon.png"
//   });

//   notification.onclick = () => {
//     window.focus();
//   };

// };

// let pendingCount = 0;
// let notificationTimer = null;

// export const showBrowserNotification = (title, body) => {

//   if (!("Notification" in window)) return;
//   if (Notification.permission !== "granted") return;

//   pendingCount++;

//   if (notificationTimer) return;

//   notificationTimer = setTimeout(() => {

//     const message =
//       pendingCount === 1
//         ? body
//         : `${pendingCount} new messages`;

//     const notification = new Notification(title, {
//       body: message,
//       icon: "/chat-icon.png"
//     });

//     notification.onclick = () => window.focus();

//     pendingCount = 0;
//     notificationTimer = null;

//   }, 800); // group messages within 800ms
// };


const queue = [];
let showing = false;

function showNext() {

  if (queue.length === 0) {
    showing = false;
    return;
  }

  showing = true;

  const { title, body } = queue.shift();

  const notification = new Notification(title, {
    body,
    icon: "/chat-icon.png"
  });

  notification.onclick = () => {
    window.focus();
  };

  // auto close after 5s
  setTimeout(() => {
    notification.close();
  }, 5000);

  setTimeout(showNext, 1200);

}

export const showBrowserNotification = (title, body) => {

  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  queue.push({ title, body });

  if (!showing) {
    showNext();
  }

};



let unreadCount = 0;

export const updateTabTitle = () => {

  unreadCount += 1;

  document.title = `(${unreadCount}) Admin Dashboard`;

};

export const resetTabTitle = () => {

  unreadCount = 0;

  document.title = "Admin Dashboard";

};