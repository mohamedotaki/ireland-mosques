// hooks/useDailyRescheduler.ts
import { useEffect } from 'react';

export const useDailyRescheduler = (onMidnight: () => void) => {
    useEffect(() => {
        // 1. Get time until midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0); // next midnight
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();

        // 2. Set timeout for midnight
        const midnightTimeout = setTimeout(() => {
            onMidnight(); // trigger callback
            // 3. Repeat every 24 hours
            const dailyInterval = setInterval(onMidnight, 24 * 60 * 60 * 1000); // every 24 hours
            // Save interval ID so we can clear it
            (window as any).__midnightInterval = dailyInterval;
        }, timeUntilMidnight);

        return () => {
            clearTimeout(midnightTimeout);
            if ((window as any).__midnightInterval) {
                clearInterval((window as any).__midnightInterval);
            }
        };
    }, [onMidnight]);
};
