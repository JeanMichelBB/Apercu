import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LocationMap.css';


const LocationMap = () => {
  const position = [45.50444953071843, -73.59579748691141]; // Replace with the actual coordinates , 

  return (
    <MapContainer center={position} zoom={14} style={{ height: '400px', width: '80%', margin: 'auto' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={L.icon({ iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png', iconSize: [50, 50] })}>
        
        <Popup>Your Law Firm</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
