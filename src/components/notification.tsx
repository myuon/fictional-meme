export const notify = (message: string) => {
  const createNotification = () => {
    return new Notification(message);
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
