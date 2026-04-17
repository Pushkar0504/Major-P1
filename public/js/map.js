(function () {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  const token = window.mapToken;
  const listingCoordinates = window.listingCoordinates;
  const listingLocation = window.listingLocation;

  if (!token) {
    console.error('Map token missing. Set process.env.MAP_TOKEN in your environment.');
    mapContainer.innerHTML = '<p class="text-center text-muted">Map token missing</p>';
    return;
  }

  if (typeof maptilersdk === 'undefined') {
    console.error('maptilersdk not loaded. Ensure the MapTiler SDK script is included in the page.');
    mapContainer.innerHTML = '<p class="text-center text-muted">Map SDK not loaded</p>';
    return;
  }

  maptilersdk.config.apiKey = token;

  const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [73.8786, 18.5246], // default center (Pune, India)
    zoom: 2,
  });

  


  const setMarkerAndCenter = (coords) => {
    map.setCenter(coords);
    map.setZoom(10);

    // Create a popup with location information
    const popup = new maptilersdk.Popup({ offset: 25 })
      .setText(window.listingLocation || 'Listing Location');

    // Create the marker with popup
    new maptilersdk.Marker({ color: "black" })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map);
  };

  const hasValidCoordinates =
    Array.isArray(listingCoordinates) &&
    listingCoordinates.length === 2 &&
    typeof listingCoordinates[0] === 'number' &&
    typeof listingCoordinates[1] === 'number';

  if (hasValidCoordinates) {
    setMarkerAndCenter(listingCoordinates);
    return;
  }

  // Fall back to client-side geocoding if we have a location string
  if (!listingLocation) return;

  const query = encodeURIComponent(listingLocation);
  const url = `https://api.maptiler.com/geocoding/${query}.json?key=${token}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data && Array.isArray(data.features) && data.features.length) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        setMarkerAndCenter([lng, lat]);
      } else {
        console.warn('Geocoding returned no features for:', listingLocation);
      }
    })
    .catch((err) => {
      console.error('Geocoding request failed:', err);
    });
})();
