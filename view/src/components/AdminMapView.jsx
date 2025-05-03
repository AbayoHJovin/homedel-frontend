import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-hot-toast";
import { Ruler, Map, Navigation, CornerDownRight } from "lucide-react";

// Fix for Leaflet's default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for admin and customer locations
const customerIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const adminIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Static reference to preserve tracking state between rerenders
const trackingState = {
  watchId: null,
  isTracking: false,
  adminLocation: null
};

const AdminMapView = ({ customerLocation }) => {
  const [adminLocation, setAdminLocation] = useState(trackingState.adminLocation);
  const [distance, setDistance] = useState(null);
  const [routeMode, setRouteMode] = useState(false);
  const [mapType, setMapType] = useState("satellite"); // satellite or streets
  const [isTracking, setIsTracking] = useState(trackingState.isTracking);
  
  const mapRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const adminMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const mapInitializedRef = useRef(false);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!customerLocation?.lat || !customerLocation?.lng) {
      return;
    }
    
    // Only initialize the map if it hasn't been created yet
    if (!mapRef.current && !mapInitializedRef.current) {
      // Initialize map centered on customer location
      const map = L.map("admin-map").setView(
        [customerLocation.lat, customerLocation.lng], 
        15
      );
      
      mapRef.current = map;
      mapInitializedRef.current = true;
      
      // Add initial tile layer (satellite)
      updateMapTileLayer(map, mapType);
      
      // Add customer marker
      const customerMarker = L.marker(
        [customerLocation.lat, customerLocation.lng],
        { icon: customerIcon }
      ).addTo(map);
      
      customerMarker.bindPopup(`
        <strong>Customer Location</strong><br>
        ${customerLocation.address || "No address available"}
      `);
      
      customerMarkerRef.current = customerMarker;
      
      // Add map controls
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);
      
      // Start tracking if it was active before
      if (trackingState.isTracking) {
        // If we already have an admin location, add the marker
        if (trackingState.adminLocation) {
          const adminMarker = L.marker(
            [trackingState.adminLocation.lat, trackingState.adminLocation.lng],
            { icon: adminIcon }
          ).addTo(map);
          
          adminMarker.bindPopup("<strong>Your Location</strong>");
          adminMarkerRef.current = adminMarker;
          
          // Calculate distance
          calculateDistance(
            trackingState.adminLocation,
            customerLocation
          );
        }
      } else {
        // Try to get admin's current location if not tracking
        getAdminLocation();
      }
      
      // Start tracking admin location if it was active before
      if (trackingState.isTracking) {
        startLocationTracking();
      }
    } else if (mapRef.current) {
      // If map exists, just update the customer marker position
      if (customerMarkerRef.current) {
        customerMarkerRef.current.setLatLng([customerLocation.lat, customerLocation.lng]);
        customerMarkerRef.current.bindPopup(`
          <strong>Customer Location</strong><br>
          ${customerLocation.address || "No address available"}
        `);
      }
      
      // If admin marker exists and we have tracking location, update route
      if (adminMarkerRef.current && trackingState.adminLocation && routeMode) {
        drawRoute(trackingState.adminLocation, customerLocation);
      }
    }
    
    // Cleanup
    return () => {
      // Don't destroy the map, just clean up tracking if component unmounts completely
      if (document.getElementById("admin-map") === null) {
        stopLocationTracking();
        mapInitializedRef.current = false;
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      }
    };
  }, [customerLocation]);
  
  useEffect(() => {
    // Update route when admin location changes
    if (routeMode && adminLocation && customerLocation) {
      drawRoute(adminLocation, customerLocation);
    }
  }, [adminLocation, routeMode]);
  
  // Start tracking admin location
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsTracking(true);
    trackingState.isTracking = true;
    
    // Clear any existing watch
    if (trackingState.watchId) {
      navigator.geolocation.clearWatch(trackingState.watchId);
    }
    
    // Start watching position with high accuracy
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const newLocation = {
          lat: latitude,
          lng: longitude,
        };
        
        // Update tracking state and component state
        trackingState.adminLocation = newLocation;
        setAdminLocation(newLocation);
        
        // Add or update admin marker
        if (adminMarkerRef.current) {
          adminMarkerRef.current.setLatLng([latitude, longitude]);
        } else if (mapRef.current) {
          const adminMarker = L.marker(
            [latitude, longitude],
            { icon: adminIcon }
          ).addTo(mapRef.current);
          
          adminMarker.bindPopup("<strong>Your Location</strong>");
          adminMarkerRef.current = adminMarker;
        }
        
        // Calculate and display distance
        calculateDistance(
          newLocation,
          customerLocation
        );
      },
      (error) => {
        console.error("Error tracking location:", error);
        toast.error("Unable to track your location: " + error.message);
        setIsTracking(false);
        trackingState.isTracking = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
    
    trackingState.watchId = id;
  };
  
  // Stop tracking admin location
  const stopLocationTracking = () => {
    if (trackingState.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(trackingState.watchId);
      trackingState.watchId = null;
      trackingState.isTracking = false;
      setIsTracking(false);
    }
  };
  
  // Update the map tile layer based on the selected map type
  const updateMapTileLayer = (map, type) => {
    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    // Add new tile layer based on selected type
    if (type === "satellite") {
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles © Esri, Earthstar Geographics",
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);
    }
  };
  
  // Get admin's current location
  const getAdminLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          const newLocation = {
            lat: latitude,
            lng: longitude,
          };
          
          // Update tracking state and component state
          trackingState.adminLocation = newLocation;
          setAdminLocation(newLocation);
          
          // Add or update admin marker
          if (adminMarkerRef.current) {
            adminMarkerRef.current.setLatLng([latitude, longitude]);
          } else if (mapRef.current) {
            const adminMarker = L.marker(
              [latitude, longitude],
              { icon: adminIcon }
            ).addTo(mapRef.current);
            
            adminMarker.bindPopup("<strong>Your Location</strong>");
            adminMarkerRef.current = adminMarker;
          }
          
          // Calculate and display distance
          calculateDistance(
            newLocation,
            customerLocation
          );
          
          // Draw route if route mode is enabled
          if (routeMode) {
            drawRoute(
              newLocation,
              customerLocation
            );
          }
        },
        (error) => {
          console.error("Error getting admin location:", error);
          toast.error("Unable to get your location. Please try again.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };
  
  // Calculate direct distance between two points
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return;
    
    // Convert from degrees to radians
    const lon1 = (point1.lng * Math.PI) / 180;
    const lon2 = (point2.lng * Math.PI) / 180;
    const lat1 = (point1.lat * Math.PI) / 180;
    const lat2 = (point2.lat * Math.PI) / 180;
    
    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    
    // Radius of earth in kilometers
    const r = 6371;
    
    // Calculate and format distance
    const distanceInKm = c * r;
    setDistance(distanceInKm.toFixed(2));
  };
  
  // Draw route between admin and customer locations
  const drawRoute = async (adminLoc, customerLoc) => {
    if (!adminLoc || !customerLoc || !mapRef.current) return;
    
    // Remove existing route layer if it exists
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
    }
    
    try {
      // Use OSRM to calculate route
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${adminLoc.lng},${adminLoc.lat};${customerLoc.lng},${customerLoc.lat}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("No route found");
      }
      
      // Create a GeoJSON layer for the route
      const routeLayer = L.geoJSON(data.routes[0].geometry, {
        style: {
          color: "#3388ff",
          weight: 5,
          opacity: 0.7,
        },
      }).addTo(mapRef.current);
      
      routeLayerRef.current = routeLayer;
      
      // Fit map to show both points and the route
      mapRef.current.fitBounds(routeLayer.getBounds(), {
        padding: [30, 30]
      });
      
      // Update distance with the actual route distance
      const routeDistance = (data.routes[0].distance / 1000).toFixed(2);
      setDistance(routeDistance);
      
    } catch (error) {
      console.error("Error fetching route:", error);
      toast.error("Unable to calculate route. Using direct distance instead.");
      
      // Draw a simple line instead
      const latlngs = [
        [adminLoc.lat, adminLoc.lng],
        [customerLoc.lat, customerLoc.lng]
      ];
      
      const polyline = L.polyline(latlngs, {
        color: "#ff3388",
        weight: 3,
        opacity: 0.7,
        dashArray: "5, 10"
      }).addTo(mapRef.current);
      
      routeLayerRef.current = polyline;
      
      // Fit map to show both points
      mapRef.current.fitBounds(polyline.getBounds(), {
        padding: [30, 30]
      });
    }
  };
  
  // Toggle route mode
  const handleToggleRoute = () => {
    const newRouteMode = !routeMode;
    setRouteMode(newRouteMode);
    
    if (newRouteMode && adminLocation) {
      drawRoute(adminLocation, customerLocation);
    } else if (!newRouteMode && routeLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
  };
  
  // Toggle map type
  const handleToggleMapType = () => {
    const newMapType = mapType === "satellite" ? "streets" : "satellite";
    setMapType(newMapType);
    
    if (mapRef.current) {
      updateMapTileLayer(mapRef.current, newMapType);
    }
  };
  
  // Toggle location tracking
  const handleToggleTracking = () => {
    if (isTracking) {
      stopLocationTracking();
      toast.success("Location tracking stopped");
    } else {
      startLocationTracking();
      toast.success("Location tracking started");
    }
  };
  
  // Show both customer and admin locations
  const handleShowBoth = () => {
    if (!mapRef.current || !adminMarkerRef.current || !customerMarkerRef.current) return;
    
    const group = new L.FeatureGroup([
      adminMarkerRef.current, 
      customerMarkerRef.current
    ]);
    
    mapRef.current.fitBounds(group.getBounds(), {
      padding: [30, 30]
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Delivery Map
        </h3>
        {distance && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
            <Ruler className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span>{distance} km</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <div
          id="admin-map"
          className="h-80 w-full rounded-lg z-10 relative shadow-lg border border-gray-200 dark:border-gray-700"
        />
        
        {/* Map controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
          <button
            onClick={getAdminLocation}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            title="Get current location"
          >
            <Navigation className="h-5 w-5 text-green-600 dark:text-green-400" />
          </button>
          
          <button
            onClick={handleToggleTracking}
            className={`p-2 rounded-lg shadow-lg transition-all duration-300 border ${
              isTracking 
                ? "bg-green-500 text-white border-green-600" 
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={isTracking ? "Stop tracking location" : "Start tracking location"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isTracking ? "text-white" : "text-green-600 dark:text-green-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={handleToggleMapType}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            title={mapType === "satellite" ? "Switch to street map" : "Switch to satellite map"}
          >
            <Map className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </button>
          
          <button
            onClick={handleToggleRoute}
            className={`p-2 rounded-lg shadow-lg transition-all duration-300 border ${
              routeMode 
                ? "bg-blue-500 text-white border-blue-600" 
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={routeMode ? "Hide route" : "Show route"}
          >
            <CornerDownRight className={`h-5 w-5 ${routeMode ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
          </button>
          
          <button
            onClick={handleShowBoth}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            title="Show both locations"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="font-medium text-blue-700 dark:text-blue-300">Customer Location</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
            {customerLocation?.address || "Not available"}
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="font-medium text-green-700 dark:text-green-300">Your Location</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
            {isTracking ? "Tracking active" : adminLocation ? "Current position" : "Not detected"}
          </p>
        </div>
      </div>
    </div>
  );
};

AdminMapView.propTypes = {
  customerLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    address: PropTypes.string,
  }).isRequired,
};

export default AdminMapView; 