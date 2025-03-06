import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, LayersControl } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngTuple } from 'leaflet';

// Corrigir o problema dos marcadores do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  country: string;
}

const AmapaMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Erro ao buscar localidades:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (locationId: number) => {
    navigate(`/location/${locationId}`);
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative z-0">
      <MapContainer
        center={[1.0, -51.5] as LatLngTuple}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Mapa">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satélite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com">ESRI</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude] as LatLngTuple}
            icon={defaultIcon}
            eventHandlers={{
              click: () => handleLocationClick(location.id)
            }}
          >
            <Tooltip 
              permanent={false}
              direction="top"
              offset={[0, -20]}
              opacity={0.9}
              className="custom-tooltip"
            >
              <div className="font-semibold">
                {location.name}
              </div>
              <div className="text-sm">
                {location.description}
              </div>
            </Tooltip>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {location.description}
                </p>
                <p className="text-sm text-gray-600">
                  {location.country}
                </p>
                <button
                  onClick={() => handleLocationClick(location.id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Ver detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AmapaMap;