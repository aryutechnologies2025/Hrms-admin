// notifications/notificationManager.js

let audio = null;

export const initNotificationSound = () => {

  if (!audio) {

    audio = new Audio("/notification.mp3");

    audio.preload = "auto";

  }

};

export const playSound = () => {

  if (!audio) initNotificationSound();

  audio.currentTime = 0;

  audio.play().catch(() => {});

};

export const requestNotificationPermission = () => {

  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {

    Notification.requestPermission();

  }

};

export const showBrowserNotification = (title, body) => {

  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body,
    icon: "/chat-icon.png"
  });

  notification.onclick = () => {
    window.focus();
  };

};



let unreadCount = 0;

export const updateTabTitle = () => {

  unreadCount += 1;

  document.title = `(${unreadCount}) Admin Dashboard`;

};

export const resetTabTitle = () => {

  unreadCount = 0;

  document.title = "Admin Dhashboard";

};