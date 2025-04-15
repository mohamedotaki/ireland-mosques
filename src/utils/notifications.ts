import { differenceInMilliseconds, parseISO } from 'date-fns';


export const showPrayerNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/icon-192x192.png', // optional
        });
    }
};

// utils/prayerScheduler.ts

export const getTimeUntilPrayer = (prayerTimeISO: string, offsetMinutes: number = 0): number => {
    const now = new Date();
    const prayerTime = parseISO(prayerTimeISO); // make sure it's in ISO format!
    const adjustedTime = new Date(prayerTime.getTime() - offsetMinutes * 60 * 1000);
    return Math.max(0, differenceInMilliseconds(adjustedTime, now));
};

