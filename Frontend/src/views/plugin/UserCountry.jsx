import { useState, useEffect } from "react";
// this is a functional component

function GetCurrentAddress() {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      fetch(url)
        .then((response) => response.json()) // coverting response to json format)
        .then((data) => setAddress(data.address))
        .catch((error) => console.log('error fetching adress:', error))
    });
  }, []);

  return address
}

export default GetCurrentAddress;
