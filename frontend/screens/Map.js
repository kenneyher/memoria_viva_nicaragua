import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import {colors} from '../helpers/palettes';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const NICARAGUA_REGION = {
  latitude: 12.865416, // approx center of Nicaragua
  longitude: -85.207229,
  latitudeDelta: 6.5,
  longitudeDelta: 6.5,
};

const Map = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (isMounted) {
          const granted = status === 'granted';
          setHasLocationPermission(granted);
          if (!granted) {
            Alert.alert('Permisos de ubicación', 'No se concedieron permisos de ubicación. Puedes continuar sin ubicación.');
          } else {
            const current = await Location.getCurrentPositionAsync({});
            if (current && current.coords) {
              setUserLocation({
                latitude: current.coords.latitude,
                longitude: current.coords.longitude,
              });
            }
          }
        }
      } catch (e) {
        // Non-fatal: keep map usable even without location
      } finally {
        if (isMounted) setIsRequestingPermission(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialRegion = useMemo(() => NICARAGUA_REGION, []);

  const handleLongPress = useCallback((event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedMarkers((prev) => [
      ...prev,
      {
        id: `${coordinate.latitude.toFixed(6)},${coordinate.longitude.toFixed(6)}-${Date.now()}`,
        coordinate,
      },
    ]);
  }, []);

  if (isRequestingPermission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFC74F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={hasLocationPermission}
        onLongPress={handleLongPress}
        toolbarEnabled
        loadingEnabled
        loadingIndicatorColor="#FFC74F"
        mapType={Platform.OS === 'android' ? 'standard' : 'mutedStandard'}
      >
        {selectedMarkers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.fgSecondary,
  },
});

export default Map;
