import { useEffect, useRef } from 'react';
import { showPrayerNotification, getTimeUntilPrayer } from '../utils/notifications';
import { getFromLocalDB, LocalStorageKeys } from '../utils/localDB';

type PrayerTimes = {
    [key: string]: string;
};

export const usePrayerNotifications = (prayerTimes: PrayerTimes) => {
    const timeouts = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        // Clear any existing timeouts first
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];

        Object.entries(prayerTimes).forEach(([name, time]) => {
            const delay = getTimeUntilPrayer(time, 0); // 10 mins before
            if (delay > 0) {
                const timeout = setTimeout(() => {
                    showPrayerNotification(`Upcoming: ${name}`, `It's almost time for ${name} prayer.`);
                }, delay);
                timeouts.current.push(timeout);
            }
        });

        return () => {
            // Cleanup on unmount
            timeouts.current.forEach(clearTimeout);
        };
    }, [prayerTimes]);
};
