import React, { createContext, useContext, useState } from 'react';
import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from '../utils/localDB';
import { getDateTimeString } from '../utils/dateTime';
import { apiGet, apiPost } from '../utils/api';
import { mosquesDatabaseType } from '../types';
import { addDays, isWithinInterval } from 'date-fns';
import { useAuth } from './AuthContext';
import { settingsType, UserType } from '../types/authTyps';
import { usePopup } from './PopupContext';
import { v4 as uuidv4 } from 'uuid';
import findClosestMosque from '../utils/findClosestMosque';
import { requestNotificationPermission } from '../utils/permissions';

const UpdateContext = createContext<{
    checkForUpdate: () => Promise<void>;
    appFirstLaunch: () => Promise<void>;
    record_active_user: () => Promise<void>;
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
        let settings: settingsType = {
            theme: "system_default",
            language: "en",
            fontSize: 14,
            timeFormatIs24H: true,
            defaultMosque: null,

        }
        saveToLocalDB(LocalStorageKeys.UUID, uuidv4())
        saveToLocalDB(LocalStorageKeys.PrayerNotifications, { "Fajr": false, "Shurooq": false, "Dhuhr": false, "Asr": false, "Maghrib": false, "Isha": false })

        requestNotificationPermission()
        const { data } = await apiGet<appFirstLunchType>("app")
        console.log("data", data)
        if (data) {
            const arrayOfMosques = Object.values(data.mosques)
            if (arrayOfMosques.length === 0) {
                setError("Please connect to internet and try later")
                return
            }
            saveToLocalDB(LocalStorageKeys.LastDataUpdate, data.newUpdateDate)
            saveToLocalDB(LocalStorageKeys.MosquesData, data.mosques)
            setMosques(data.mosques)
            try {
                const closestMosque = await findClosestMosque(arrayOfMosques)
                settings = { ...settings, defaultMosque: closestMosque?.id || null }
                saveToLocalDB(LocalStorageKeys.DefaultMosque, closestMosque || arrayOfMosques[0])
                setDefaultMosque(closestMosque || arrayOfMosques[0])
            } catch (error) {
                saveToLocalDB(LocalStorageKeys.DefaultMosque, arrayOfMosques[0])
                setDefaultMosque(arrayOfMosques[0])
            }
            setLoading(false)
            saveToLocalDB(LocalStorageKeys.FirstLaunch, true)

        } else {
            setError("Unable to get mosques and prayers data. please connect to internet and try later")
        }
        saveToLocalDB(LocalStorageKeys.AppSettings, settings)

    }


    const checkForUpdate = async () => {
        const lastUpdate = getFromLocalDB(LocalStorageKeys.LastDataUpdate)
        if (lastUpdate) {
            const userLastUpdate = getDateTimeString(new Date(lastUpdate))
            const { data } = await apiGet<{ mosques: { [key: string]: mosquesDatabaseType }, newUpdateDate: Date, user: UserType }>(`app/checkForNewData`, { userLastUpdate })
            if (data) {
                data.newUpdateDate && saveToLocalDB(LocalStorageKeys.LastDataUpdate, data.newUpdateDate)

                if (data.user) {
                    updateUser(data.user)
                }
                const updatedMosquesIDs = Object.keys(data.mosques).map(Number);
                if (updatedMosquesIDs.length > 0) {
                    const localDBMosques = getFromLocalDB(LocalStorageKeys.MosquesData)
                    const localDBDefaultMosques = getFromLocalDB(LocalStorageKeys.DefaultMosque)
                    updatedMosquesIDs.forEach((mosqueID) => {
                        if (localDBDefaultMosques.id === mosqueID) {
                            const updatedMosque = data.mosques[mosqueID].time_table ? data.mosques[mosqueID] : { ...data.mosques[mosqueID], time_table: localDBDefaultMosques.time_table }
                            saveToLocalDB(LocalStorageKeys.DefaultMosque, updatedMosque)
                            setDefaultMosque(updatedMosque)
                        }
                        const updatedMosque = data.mosques[mosqueID].time_table ? data.mosques[mosqueID] : { ...data.mosques[mosqueID], time_table: localDBDefaultMosques.time_table }
                        localDBMosques[mosqueID] = updatedMosque
                    })
                    setMosques(localDBMosques)
                    saveToLocalDB(LocalStorageKeys.MosquesData, localDBMosques)
                }

            } else {
                const todaysDate = new Date()
                if (!isWithinInterval(new Date(lastUpdate), { start: addDays(todaysDate, -5), end: addDays(todaysDate, 2) })) {
                    showPopup({ message: "Unable to update mosques and prayers data. Please connect to the internet to update", type: "warning" })
                }
            }
            setLoading(false)
        }


    };


    const record_active_user = async () => {
        const UserActiveDate = getFromLocalDB(LocalStorageKeys.UserActiveDate)
        if (!UserActiveDate || new Date(UserActiveDate).getDate() < new Date().getDate()) {
            const uuid = getFromLocalDB(LocalStorageKeys.UUID)
            const newDate = new Date()
            saveToLocalDB(LocalStorageKeys.UserActiveDate, newDate)
            await apiPost<{ uuid: string }, { res: string }>("app/active_user", { uuid })
        }
    }

    return (
        <UpdateContext.Provider value={{ record_active_user, checkForUpdate, loading, error, appFirstLaunch, mosques, defaultMosque }}>
            {children}
        </UpdateContext.Provider>
    );
};
