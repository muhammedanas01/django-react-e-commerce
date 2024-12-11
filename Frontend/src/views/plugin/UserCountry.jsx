import { useState, useEffect } from "react";

function useCurrentAddress() {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => setAddress(data)) // Store the full response
          .catch((error) => console.log("Error fetching address:", error));
      },
      (error) => console.log("Geolocation error:", error)
    );
  }, []);

  return address;
}

export default useCurrentAddress;


