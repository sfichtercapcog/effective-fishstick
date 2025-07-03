document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing map...');

    // Initialize map with Central Texas coordinates, disable default zoom control
    const map = L.map('map', {
        center: [30.2672, -97.7431],
        zoom: 10,
        scrollWheelZoom: true,
        zoomControl: false // Prevents duplicate zoom buttons
    });

    // Add ESRI Streets basemap (replacing OSM)
    const esriLayer = L.esri.basemapLayer('Streets', {
        maxZoom: 18
    }).addTo(map);

    // Add custom zoom control
    L.control.zoom({
        position: 'topright'
    }).addTo(map); // Single zoom control

    // Add scale control
    L.control.scale().addTo(map); // Scale bar

    // Ensure map renders correctly
    map.invalidateSize();
    console.log('Map initialized');

    // Store current layer for cleanup
    let currentLayer = null;

    // Layer control configuration (updated to reference ESRI basemap)
    const baseLayers = {
        'ESRI Streets': esriLayer
    };

    const overlayLayers = {};

    // Fetch and display data
    async function loadData(layerName, url, styleFunc, popupFunc, pointStyleFunc) {
        try {
            console.log(`Fetching data from ${url}...`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
            const data = await response.json();
            console.log('Data fetched:', data);

            if (!data || !data.features || data.features.length === 0) {
                throw new Error('Invalid or empty GeoJSON data');
            }

            if (currentLayer) map.removeLayer(currentLayer);

            currentLayer = L.geoJSON(data, {
                style: styleFunc,
                pointToLayer: pointStyleFunc ? (feature, latlng) => pointStyleFunc(feature, latlng) : null,
                onEachFeature: popupFunc
            }).addTo(map);

            overlayLayers[layerName] = currentLayer;

            map.fitBounds(currentLayer.getBounds() || [[30.2672, -97.7431], [30.2672, -97.7431]], { padding: [50, 50] });
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Failed to load data. Check console for details.');
        }
    }

    // Map configurations with enhanced styling
    const mapConfigs = {
        road: {
            url: '/assets/data/road_network.json',
            style: feature => ({
                color: feature.properties?.type === 'Arterial' ? '#e74c3c' : '#3498db',
                weight: feature.properties?.lanes || 2,
                opacity: 0.8
            }),
            popup: (feature, layer) => layer.bindPopup(`
                <b>${feature.properties?.name || 'Unnamed Road'}</b><br>
                Type: ${feature.properties?.type || 'Unknown'}<br>
                Lanes: ${feature.properties?.lanes || 0}
            `)
        },
        transit: {
            url: '/assets/data/transit_routes.json',
            style: feature => ({ color: '#2ecc71', weight: 3, opacity: 0.9 }),
            popup: (feature, layer) => {
                const props = feature.properties || {};
                layer.bindPopup(`
                    <b>${props.name || 'Unnamed Route'}</b><br>
                    Type: ${props.type || 'Unknown'}<br>
                    ${props.routes ? 'Routes: ' + props.routes.join(', ') : 'Frequency: ' + (props.frequency || 'N/A')}
                `);
            },
            pointStyle: (feature, latlng) => L.circleMarker(latlng, {
                radius: 6,
                fillColor: '#2ecc71',
                color: '#ffffff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
        },
        traffic: {
            url: '/assets/data/traffic_volume.json',
            popup: (feature, layer) => {
                const props = feature.properties || {};
                layer.bindPopup(`
                    <b>${props.location || 'Unknown Location'}</b><br>
                    Daily Volume: ${props.volume || 0} vehicles<br>
                    Peak Hour: ${props.peak_hour || 'N/A'}
                `);
            },
            pointStyle: (feature, latlng) => {
                const volume = feature.properties?.volume || 0;
                return L.circle(latlng, {
                    radius: (volume / 1000) || 1,
                    fillColor: volume > 50000 ? '#e74c3c' : '#f1c40f',
                    color: '#ffffff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.7
                });
            }
        },
        bike: {
            url: '/assets/data/bike_infrastructure.json',
            style: feature => ({
                color: feature.properties?.type === 'Protected' ? '#2980b9' : '#3498db',
                weight: 4,
                opacity: 0.9,
                dashArray: feature.properties?.type === 'Protected' ? '' : '5, 10'
            }),
            popup: (feature, layer) => {
                const props = feature.properties || {};
                layer.bindPopup(`
                    <b>${props.name || 'Unnamed Path'}</b><br>
                    Type: ${props.type || 'Unknown'}<br>
                    ${props.width ? 'Width: ' + props.width : 'Capacity: ' + (props.capacity || 'N/A')}
                `);
            }
        },
        crash_hotspots: {
            url: '/assets/data/crash_hotspots.json',
            pointStyle: (feature, latlng) => {
                const severity = feature.properties?.severity || 'Minor Injury';
                const crashCount = feature.properties?.crash_count || 0;
                let color;
                switch (severity) {
                    case 'Fatal':
                        color = '#e74c3c';
                        break;
                    case 'Serious Injury':
                        color = '#e67e22';
                        break;
                    case 'Minor Injury':
                        color = '#f1c40f';
                        break;
                    default:
                        color = '#f1c40f';
                }
                return L.circleMarker(latlng, {
                    radius: Math.min(10 + crashCount / 10, 20),
                    fillColor: color,
                    color: '#ffffff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            popup: (feature, layer) => {
                const props = feature.properties || {};
                layer.bindPopup(`
                    <b>${props.location || 'Unknown Location'}</b><br>
                    Crashes: ${props.crash_count || 0}<br>
                    Severity: ${props.severity || 'Unknown'}<br>
                    Main Cause: ${props.contributing_factor || 'Unknown'}<br>
                    Last Incident: ${props.last_incident || 'N/A'}
                `);
            }
        }
    };

    // Button event listeners
    document.querySelectorAll('button[data-map]').forEach(button => {
        button.addEventListener('click', () => {
            const mapType = button.getAttribute('data-map');
            const config = mapConfigs[mapType];
            if (config) {
                console.log(`Switching to ${mapType} map...`);
                loadData(mapType, config.url, config.style, config.popup, config.pointStyle);
            } else {
                console.error(`Invalid map type: ${mapType}`);
            }
        });
    });

    // Load road map by default
    console.log('Loading default road map...');
    loadData('road', mapConfigs.road.url, mapConfigs.road.style, mapConfigs.road.popup);
});