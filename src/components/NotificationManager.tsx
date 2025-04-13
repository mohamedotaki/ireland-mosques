// components/NotificationManager.tsx
import { useEffect, useState } from 'react';
import { usePrayerNotifications } from '../hooks/usePrayerNotifications';
import { useDailyRescheduler } from '../hooks/useDailyRescheduler';
import { PrayerType } from '../types';

// Make sure this matches your prayer data
type PrayerTimes = {
    [key: string]: string; // e.g. { Fajr: "2025-04-13T04:45:00" }
};

const NotificationManager = ({ todaysPrayers, notificationsSettings }: { todaysPrayers: PrayerType[], notificationsSettings: { [key: string]: boolean } }) => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>({});

    // Initial fetch and permission request
    useEffect(() => {
        let newData = {}
        todaysPrayers.forEach(prayer => {
            if (notificationsSettings[prayer.name]) {
                newData = { ...newData, [prayer.name]: prayer.adhan.toISOString() };
            }
        });
        setPrayerTimes(newData);
    }, [todaysPrayers]);

    // Hook to schedule notifications
    usePrayerNotifications(prayerTimes);

    // Reschedule at midnight
    /*     useDailyRescheduler(() => {
            const updatedTimes = getTodaysPrayerTimes();
            setPrayerTimes(updatedTimes);
        }); */

    return null; // No UI needed
};

export default NotificationManager;
