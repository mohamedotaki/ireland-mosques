import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from "./localDB";
import { v4 as uuidv4 } from 'uuid';



export const getDeviceID = () => {
    let deviceID = getFromLocalDB(LocalStorageKeys.UUID)
    if (!deviceID) {
        deviceID = uuidv4()
        saveToLocalDB(LocalStorageKeys.UUID, deviceID)
    }
    return deviceID
};


