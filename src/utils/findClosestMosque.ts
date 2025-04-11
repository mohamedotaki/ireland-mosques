import { mosquesDatabaseType } from "../types";
import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from "./localDB";

const findClosestMosque = (mosques: Array<mosquesDatabaseType>): Promise<mosquesDatabaseType | null> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return reject("Geolocation is not supported by this browser.");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        let closest: mosquesDatabaseType | null = null;
        let minDistance = Infinity;

        mosques.forEach((mosque) => {
          const distance = haversine(userLat, userLng, mosque.latitude, mosque.longitude);
          if (distance < minDistance) {
            closest = mosque;
            minDistance = distance;
          }
        });
        saveToLocalDB(LocalStorageKeys.DefaultMosque, closest)
        resolve(closest);
      },
      (error) => {
        resolve(getFromLocalDB(LocalStorageKeys.DefaultMosque));
      }, {
      enableHighAccuracy: true, // Try to get the most accurate location
      /*     timeout: 10000, // Timeout after 10 seconds
          maximumAge: 0 // Prevent using cached location */
    }
    );
  });
};

// Haversine formula to calculate distance
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Convert degrees to radians
function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

export default findClosestMosque;
