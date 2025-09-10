// Initialize the map
const map = L.map('map').setView([19.0760, 72.8777], 6); // Centered on Mumbai

// Add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Property data (based on L&T Realty locations)
const properties = [
    {
        name: "Seawoods Residences",
        location: [19.0330, 73.0297],
        type: "Residential",
        city: "Navi Mumbai",
        description: "Premium residential complex with modern amenities"
    },
    {
        name: "77 Crossroads",
        location: [19.0896, 72.9081],
        type: "Residential", 
        city: "Ghatkopar (E), Mumbai",
        description: "Contemporary living spaces in the heart of Mumbai"
    },
    {
        name: "Emerald Isle",
        location: [19.1136, 72.9081],
        type: "Residential",
        city: "Powai, Mumbai", 
        description: "Luxurious apartments overlooking scenic landscapes"
    },
    {
        name: "Crescent Bay",
        location: [19.0144, 72.8317],
        type: "Residential",
        city: "Parel, Mumbai",
        description: "Premium residential project in central Mumbai"
    },
    {
        name: "Raintree Boulevard",
        location: [13.0358, 77.5970],
        type: "Residential",
        city: "Hebbal, Bengaluru",
        description: "Serene living experience in Bengaluru"
    },
    {
        name: "L&T Business Park",
        location: [19.1136, 72.9081],
        type: "Commercial",
        city: "Powai, Mumbai",
        description: "State-of-the-art business park facility"
    },
    {
        name: "Seawoods Grand Central",
        location: [19.0330, 73.0297],
        type: "Commercial",
        city: "Navi Mumbai",
        description: "Mixed-use development with retail and commercial spaces"
    },
    {
        name: "L&T Tech Park",
        location: [13.0358, 77.5970],
        type: "Commercial",
        city: "Bengaluru",
        description: "Technology park supporting innovation and growth"
    },
    {
        name: "L&T Innovation Campus",
        location: [13.0827, 80.2707],
        type: "Commercial",
        city: "Chennai",
        description: "Modern campus fostering technological advancement"
    }
];

// Custom icons for different property types
const residentialIcon = L.divIcon({
    className: 'custom-marker residential-marker',
    html: '<div style="background-color: #3498db; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
});

const commercialIcon = L.divIcon({
    className: 'custom-marker commercial-marker',
    html: '<div style="background-color: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
});

// Add markers to the map
properties.forEach(property => {
    const icon = property.type === 'Residential' ? residentialIcon : commercialIcon;
    
    const marker = L.marker(property.location, { icon: icon }).addTo(map);
    
    // Create popup content
    const popupContent = `
        <div class="popup-title">${property.name}</div>
        <div class="popup-type">${property.type}</div>
        <div style="margin-bottom: 5px;"><strong>Location:</strong> ${property.city}</div>
        <div class="popup-description">${property.description}</div>
    `;
    
    marker.bindPopup(popupContent);
    
    // Add hover effects
    marker.on('mouseover', function(e) {
        this.openPopup();
    });
});

// Add map controls
L.control.scale().addTo(map);

// Fit map to show all markers
const group = new L.featureGroup(map._layers);
if (Object.keys(group._layers).length > 0) {
    map.fitBounds(group.getBounds().pad(0.1));
}

// Add search functionality (optional enhancement)
function searchLocation(query) {
    const found = properties.find(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase())
    );
    
    if (found) {
        map.setView(found.location, 14);
        // Find and open the corresponding marker popup
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                const latLng = layer.getLatLng();
                if (latLng.lat === found.location[0] && latLng.lng === found.location[1]) {
                    layer.openPopup();
                }
            }
        });
    }
}