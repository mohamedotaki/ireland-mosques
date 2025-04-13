// utils/notifications.ts
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications.');
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
};
