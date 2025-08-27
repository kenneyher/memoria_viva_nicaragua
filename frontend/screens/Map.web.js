import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon paths for Leaflet in bundlers
// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const NICARAGUA_CENTER = [12.865416, -85.207229];

// Public GeoJSON for Nicaragua (no API key required)
const NICARAGUA_GEOJSON_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/NIC.geo.json';
// ADM1 (Departments) and ADM2 (Municipalities) from geoBoundaries (public)
const NIC_ADM1_URL = 'https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/gbOpen/NIC/ADM1/geoBoundaries-NIC-ADM1.geojson';
const NIC_ADM2_URL = 'https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/gbOpen/NIC/ADM2/geoBoundaries-NIC-ADM2.geojson';

const ClickToAddMarker = ({ onAdd }) => {
  useMapEvents({
    click(e) {
      onAdd([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [nicaraguaGeoJson, setNicaraguaGeoJson] = useState(null);
  const [adm1, setAdm1] = useState(null);
  const [adm2, setAdm2] = useState(null);
  const [showAdm1, setShowAdm1] = useState(true);
  const [showAdm2, setShowAdm2] = useState(false);
  const center = useMemo(() => NICARAGUA_CENTER, []);
  const boundsRef = useRef(null);

  // Inject Leaflet CSS via <link> tag to avoid bundling CSS in native builds
  useEffect(() => {
    const id = 'leaflet-css-cdn';
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }
  }, []);

  const handleAdd = useCallback((latlng) => {
    setMarkers((prev) => [
      ...prev,
      { id: `${latlng[0].toFixed(6)},${latlng[1].toFixed(6)}-${Date.now()}`, position: latlng },
    ]);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch(NICARAGUA_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setNicaraguaGeoJson(data);
      })
      .catch(() => {
        // ignore fetch errors; map still works without outline
      });
    // Load ADM1
    fetch(NIC_ADM1_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setAdm1(data);
      })
      .catch(() => {});
    // Load ADM2
    fetch(NIC_ADM2_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setAdm2(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const FitBoundsOnData = () => {
    const map = useMap();
    useEffect(() => {
      if (!nicaraguaGeoJson) return;
      const layer = new L.GeoJSON(nicaraguaGeoJson);
      const b = layer.getBounds();
      boundsRef.current = b;
      map.fitBounds(b, { padding: [16, 16] });
      map.setMaxBounds(b.pad(0.2));
    }, [map, nicaraguaGeoJson]);
    return null;
  };

  return (
    <div style={{ flex: 1, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <div style={{ padding: 8, display: 'flex', gap: 16, alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={showAdm1} onChange={(e) => setShowAdm1(e.target.checked)} /> Departamentos
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={showAdm2} onChange={(e) => setShowAdm2(e.target.checked)} /> Municipios
        </label>
      </div>
      <MapContainer
        center={center}
        zoom={6}
        style={{ flex: 1, backgroundColor: '#ffffff' }}
        maxBounds={boundsRef.current || null}
        maxBoundsViscosity={0.7}
        worldCopyJump={false}
        zoomControl
        attributionControl={false}
      >
        {nicaraguaGeoJson && (
          <GeoJSON data={nicaraguaGeoJson} style={{ color: '#2563eb', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.05 }} />
        )}
        {showAdm1 && adm1 && (
          <GeoJSON
            data={adm1}
            style={{ color: '#10b981', weight: 1.5, fillColor: '#10b981', fillOpacity: 0.08 }}
            onEachFeature={(feature, layer) => {
              const name = feature?.properties?.shapeName || feature?.properties?.NAME_1 || feature?.properties?.name || 'Departamento';
              layer.bindTooltip(name, { permanent: true, direction: 'center', className: 'adm1-label' });
            }}
          />
        )}
        {showAdm2 && adm2 && (
          <GeoJSON
            data={adm2}
            style={{ color: '#f59e0b', weight: 0.8, fillColor: '#f59e0b', fillOpacity: 0.03 }}
            onEachFeature={(feature, layer) => {
              const name = feature?.properties?.shapeName || feature?.properties?.NAME_2 || feature?.properties?.name || 'Municipio';
              layer.bindTooltip(name, { permanent: false, direction: 'auto', sticky: true, opacity: 0.9 });
            }}
          />
        )}
        <FitBoundsOnData />
        <ClickToAddMarker onAdd={handleAdd} />
        {markers.map((m) => (
          <Marker key={m.id} position={m.position} />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
