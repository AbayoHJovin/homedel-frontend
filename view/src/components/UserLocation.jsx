import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-hot-toast";

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

const UserLocation = ({ onLocationSelect, readOnly, initialLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    lat: initialLocation?.lat || 0,
    lng: initialLocation?.lng || 0,
    address: initialLocation?.address || "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Initialize map
    const map = L.map("map", {
      dragging: !readOnly,
      touchZoom: !readOnly,
      doubleClickZoom: !readOnly,
      scrollWheelZoom: !readOnly,
      boxZoom: !readOnly,
      keyboard: !readOnly,
      zoomControl: !readOnly,
    });

    if (initialLocation?.lat && initialLocation?.lng) {
      map.setView([initialLocation.lat, initialLocation.lng], 18);
    } else {
      map.setView([-1.9403, 29.8739], 13);
    }

    mapRef.current = map;

    // Add satellite tile layer
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles © Esri, Earthstar Geographics",
        maxZoom: 19,
      }
    ).addTo(map);

    // Add marker
    const marker = L.marker(
      initialLocation?.lat && initialLocation?.lng
        ? [initialLocation.lat, initialLocation.lng]
        : [-1.9403, 29.8739],
      { draggable: !readOnly }
    ).addTo(map);
    markerRef.current = marker;

    if (!readOnly) {
      // Handle marker drag
      marker.on("dragend", function () {
        const pos = marker.getLatLng();
        setCurrentLocation((prev) => ({
          ...prev,
          lat: pos.lat,
          lng: pos.lng,
        }));
        reverseGeocode(pos.lat, pos.lng);
      });

      // Get user's current location if no initial location
      if (!initialLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 18);
            marker.setLatLng([latitude, longitude]);
            setCurrentLocation((prev) => ({
              ...prev,
              lat: latitude,
              lng: longitude,
            }));
            reverseGeocode(latitude, longitude);
          },
          () => {
            console.warn("Geolocation failed, using Kigali as fallback");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }
    }

    // Cleanup
    return () => {
      map.remove();
    };
  }, [readOnly, initialLocation]);

  const reverseGeocode = async (lat, lng) => {
    if (readOnly) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      setCurrentLocation((prev) => ({
        ...prev,
        address: data.display_name,
      }));
      onLocationSelect({
        lat,
        lng,
        address: data.display_name,
      });
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  // Only render search and location controls if not in readOnly mode
  if (readOnly) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <div
            id="map"
            className="h-48 w-full rounded-lg z-10 relative shadow-lg border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
    );
  }

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    setSearchError(null);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&addressdetails=1&countrycodes=rw&limit=5`
      );
      const results = await response.json();
      if (results.length === 0) {
        setSearchError(
          "Make sure you have typed the correct location and wait for locations to load"
        );
      } else {
        setSuggestions(results);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSearchError("An error occurred while searching. Please try again.");
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    mapRef.current.setView([lat, lon], 18);
    markerRef.current.setLatLng([lat, lon]);
    setCurrentLocation({
      lat,
      lng: lon,
      address: place.display_name,
    });
    setSearchTerm(place.display_name);
    setShowSuggestions(false);
    onLocationSelect({
      lat,
      lng: lon,
      address: place.display_name,
    });
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current.setView([latitude, longitude], 18);
          markerRef.current.setLatLng([latitude, longitude]);
          setCurrentLocation((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
          }));
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
        Pick Delivery Location
      </h3>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for your delivery location..."
            className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>

        {searchError && (
          <div className="mt-2 text-red-500 text-sm">{searchError}</div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((place, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(place)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200 text-sm"
              >
                {place.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <div
          id="map"
          className="h-96 w-full rounded-lg z-10 relative shadow-lg border border-gray-200 dark:border-gray-700"
        />
        <button
          onClick={handleMyLocation}
          className="absolute bottom-4 right-4 z-20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2 border border-gray-200 dark:border-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>My Location</span>
        </button>
      </div>

      <div className="bg-green-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Selected Location:</span>{" "}
          {currentLocation.address || "No location selected"}
        </p>
      </div>
    </div>
  );
};

UserLocation.propTypes = {
  onLocationSelect: PropTypes.func,
  readOnly: PropTypes.bool,
  initialLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    address: PropTypes.string,
  }),
};

UserLocation.defaultProps = {
  readOnly: false,
  onLocationSelect: () => {},
};

export default UserLocation;
