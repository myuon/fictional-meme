export const notify = (
  message: string,
  options?: NotificationOptions & {
    url?: string;
  }
) => {
  const createNotification = () => {
    const { url, ...notificationOptions } = options ?? {};

    const notification = new Notification(message, notificationOptions);
    if (url) {
      notification.onclick = () => {
        window.open(url, "_blank");
      };
    }

    return notification;
  };

  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification");
    return;
  } else if (Notification.permission === "granted") {
    createNotification();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        createNotification();
      }
    });
  }
};
