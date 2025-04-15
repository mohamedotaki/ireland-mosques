import React, { createContext, useContext, useState } from 'react';
import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from '../utils/localDB';
import { getDateTimeString } from '../utils/dateTime';
import { apiGet } from '../utils/api';
import { mosquesDatabaseType } from '../types';
import { addDays, isWithinInterval } from 'date-fns';
import { useAuth } from './AuthContext';
import { UserType } from '../types/authTyps';
import { usePopup } from './PopupContext';
import { v4 as uuidv4 } from 'uuid';
import findClosestMosque from '../utils/findClosestMosque';
import { requestNotificationPermission } from '../utils/permissions';

const UpdateContext = createContext<{
    checkForUpdate: () => Promise<void>;
    appFirstLaunch: () => Promise<void>;
    loading: boolean;
    error: string;
    mosques: { [key: string]: mosquesDatabaseType } | null;
    defaultMosque: mosquesDatabaseType;

} | undefined>(undefined);

interface appFirstLunchType {
    mosques: { [key: string]: mosquesDatabaseType };
    newUpdateDate: Date;
}

export const useUpdate = () => {
    const context = useContext(UpdateContext);
    if (!context) throw new Error('useUpdate must be used within UpdateProvider');
    return context;
};

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { updateUser } = useAuth()
    const { showPopup } = usePopup()
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [mosques, setMosques] = useState<{ [key: string]: mosquesDatabaseType } | null>(getFromLocalDB(LocalStorageKeys.MosquesData));
    const [defaultMosque, setDefaultMosque] = useState<mosquesDatabaseType>(getFromLocalDB(LocalStorageKeys.DefaultMosque));


    const appFirstLaunch = async () => {
        saveToLocalDB(LocalStorageKeys.TimeFormatIs24H, true)
        saveToLocalDB(LocalStorageKeys.UUID, uuidv4())
        saveToLocalDB(LocalStorageKeys.PrayerNotifications, { "Fajr": true, "Shurooq": false, "Dhuhr": true, "Asr": true, "Maghrib": true, "Isha": true })

        requestNotificationPermission()
        const { data } = await apiGet<appFirstLunchType>("app")
        if (data) {
            const arrayOfMosques = Object.values(data.mosques)
            if (arrayOfMosques.length === 0) {
                setError("Please connect to internet and try later")
                return
            }
            saveToLocalDB(LocalStorageKeys.FirstLaunch, true)
            saveToLocalDB(LocalStorageKeys.LastDataUpdate, data.newUpdateDate)
            saveToLocalDB(LocalStorageKeys.MosquesData, data.mosques)
            setMosques(data.mosques)
            try {
                const closestMosque = await findClosestMosque(arrayOfMosques)
                saveToLocalDB(LocalStorageKeys.DefaultMosque, closestMosque || arrayOfMosques[0])
                setDefaultMosque(closestMosque || arrayOfMosques[0])
            } catch (error) {
                saveToLocalDB(LocalStorageKeys.DefaultMosque, arrayOfMosques[0])
                setDefaultMosque(arrayOfMosques[0])
            }
            setLoading(false)
        } else {
            setError("Unable to get mosques and prayers data. please connect to internet and try later")
        }
    }


    const checkForUpdate = async () => {
        const lastUpdate = getFromLocalDB(LocalStorageKeys.LastDataUpdate)
        if (lastUpdate) {
            const userLastUpdate = getDateTimeString(new Date(lastUpdate))
            const { data } = await apiGet<{ mosques: { [key: string]: mosquesDatabaseType }, newUpdateDate: Date, user: UserType }>(`app/checkForNewData`, { userLastUpdate })
            if (data) {
                if (data.user) {
                    updateUser(data.user)
                }
                const updatedMosquesIDs = Object.keys(data.mosques).map(Number);
                if (updatedMosquesIDs.length > 0) {
                    const localDBMosques = getFromLocalDB(LocalStorageKeys.MosquesData)
                    const localDBDefaultMosques = getFromLocalDB(LocalStorageKeys.DefaultMosque)
                    updatedMosquesIDs.forEach((mosqueID) => {
                        if (localDBDefaultMosques.id === mosqueID) {
                            saveToLocalDB(LocalStorageKeys.DefaultMosque, data.mosques[mosqueID])
                            setDefaultMosque(data.mosques[mosqueID])
                        }
                        const updatedMosque = data.mosques[mosqueID]
                        localDBMosques[mosqueID] = updatedMosque
                    })
                    setMosques(localDBMosques)
                    saveToLocalDB(LocalStorageKeys.MosquesData, localDBMosques)
                }
                saveToLocalDB(LocalStorageKeys.LastDataUpdate, data.newUpdateDate)

            } else {
                const todaysDate = new Date()
                if (!isWithinInterval(new Date(lastUpdate), { start: addDays(todaysDate, -5), end: addDays(todaysDate, 2) })) {
                    showPopup({ message: "Unable to update mosques and prayers data. Please connect to the internet to update", type: "warning" })
                }
            }
            setLoading(false)
        }


    };

    return (
        <UpdateContext.Provider value={{ checkForUpdate, loading, error, appFirstLaunch, mosques, defaultMosque }}>
            {children}
        </UpdateContext.Provider>
    );
};
