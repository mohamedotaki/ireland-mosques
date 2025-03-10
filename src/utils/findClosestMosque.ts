import { mosquesDatabaseType } from "../types";

const findClosestMosque = (mosques:Array<mosquesDatabaseType>)=>{
  let closest:mosquesDatabaseType;
  let minDistance = Infinity;
 

  navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
     const userLng = position.coords.longitude;
     mosques.forEach((mosque) => {
      const distance = haversine(userLat, userLng, mosque.latitude, mosque.longitude);

      if (distance < minDistance) {
        closest = mosque;
        minDistance = distance;
      }
    });
    return closest

  });






/*   setClosestMosque({
    name: closest.name,
    distance: minDistance.toFixed(2)
  }); */
}

function haversine(lat1:number, lon1:number, lat2:number, lon2:number) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(degrees:number) {
  return degrees * Math.PI / 180;
}


export default findClosestMosque