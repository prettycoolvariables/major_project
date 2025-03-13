import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./install.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "800px",
  height: "400px",
};

const kakkanad = { lat: 10.0159, lng: 76.3419 }; // Kakkanad, Kerala coordinates

const nearbyCities = [
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Kakkanad", lat: 10.0159, lng: 76.3419 },
  { name: "Aluva", lat: 10.1076, lng: 76.351 },
  { name: "Thrippunithura", lat: 9.945, lng: 76.3415 },
];

const Install = () => {
const [userLocation, setUserLocation] = useState(null);

  // Function to get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="installs">
      <div className="ititle">
        <h2>Installations</h2>  </div>
        <div className="nav">
        <Link to="/dashboard" className="nav-item">
          DASHBOARD
        </Link>
        <Link to="/history" className="nav-item">
          HISTORY
        </Link>
        <Link to="/" className="nav-item">
          LOGOUT
        </Link>
      </div>
<br></br>
    <div className="maps">

          <LoadScript googleMapsApiKey="AIzaSyDpgNy2qN3T3wyXtgbkYote7iqOVoz6Z50">
            <GoogleMap mapContainerStyle={mapContainerStyle} center={kakkanad} zoom={12}>
     
              {/* Markers for nearby cities */}
              {nearbyCities.map((city, index) => (
                <Marker key={index} position={{ lat: city.lat, lng: city.lng }} label={city.name} />
              ))}
    
              {/* Marker for User Location (if found) */}
              {/* {userLocation && <Marker position={userLocation} label="You are here" />} */}
            </GoogleMap>
          </LoadScript>
    
          {/* <button
            onClick={getUserLocation}
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "blue",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Show My Location
          </button> */}
        </div>
    </div>
  );
};

export default Install;
