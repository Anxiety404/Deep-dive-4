let mapOptions = {
    center:[52.518936, 4.972810],
    zoom:18
}

let markerCoords = [];
let polyline = null;
let markers = []; // Store marker objects and their data
let editingMarkerIndex = null; // Track which marker is being edited

let map = new L.map('map' , mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

document.getElementById('btn').addEventListener('click', function() {
    editingMarkerIndex = null; // Not editing, adding new
    document.getElementById('marker-inputs').style.display = 'block';
});

document.getElementById('close-marker-inputs').addEventListener('click', function() {
    document.getElementById('marker-inputs').style.display = 'none';
});

function insertLineBreaks(text, maxLen = 25) {
    let result = '';
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        result += text[i];
        count++;
        if (count >= maxLen && text[i] === ' ') {
            result += '<br>';
            count = 0;
        }
    }
    return result;
}

function markerContent(data, index) {
    let html = `<strong>${data.title || 'No title'}</strong><br>`;
    if (data.images && data.images.length > 0) {
        data.images.forEach(src => {
            html += `<img src="${src}" style="max-width:220px;max-height:180px;display:inline-block;margin:6px;">`;
        });
        html += '<br>';
    }
    html += `<span>${insertLineBreaks(data.desc || '')}</span><br>`;
    html += `<button id="edit-marker-btn" data-index="${index}">Edit</button>`;
    return html;
}

function addMarkerToMap(data) {
    const marker = L.marker([data.lat, data.lng]).addTo(map);
    marker.on('click', function () {
        // Populate the #marker-info div with the marker's content
        const markerInfoDiv = document.getElementById('marker-info');
        markerInfoDiv.innerHTML = `
            <h2>${data.title || 'No Title'}</h2>
            <p>${insertLineBreaks(data.desc || 'No Description')}</p>
            ${data.images && data.images.length > 0
                ? data.images.map(src => `<img src="${src}" style="max-width:100%; margin-bottom: 10px;">`).join('')
                : '<p>No Images</p>'
            }
        `;
    });

    const markerObj = { marker, ...data };
    markers.push(markerObj);
    markerCoords.push([data.lat, data.lng]);
    updatePolyline();
}

function updatePolyline() {
    if (polyline) map.removeLayer(polyline);
    polyline = L.polyline(markerCoords, {
        color: 'black',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.7
    }).addTo(map);
}

function startEditMarker(index) {
    const data = markers[index];
    editingMarkerIndex = index;
    document.getElementById('lat').value = data.lat;
    document.getElementById('lng').value = data.lng;
    document.getElementById('marker-title').value = data.title;
    document.getElementById('marker-desc').value = data.desc;
    document.getElementById('marker-img').value = '';
    document.getElementById('marker-inputs').style.display = 'block';
}

document.getElementById('add-marker-btn').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const title = document.getElementById('marker-title').value;
    const desc = document.getElementById('marker-desc').value;
    const imgInput = document.getElementById('marker-img');
    const files = imgInput.files;

    function getImages(callback) {
        if (files.length > 0) {
            let images = [];
            let loaded = 0;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    images.push(e.target.result);
                    loaded++;
                    if (loaded === files.length) callback(images);
                };
                reader.readAsDataURL(files[i]);
            }
        } else {
            callback(editingMarkerIndex !== null ? markers[editingMarkerIndex].images : []);
        }
    }

    if (!isNaN(lat) && !isNaN(lng)) {
        getImages(function(images) {
            const data = { lat, lng, title, desc, images };
            if (editingMarkerIndex !== null) {
                // Update marker info
                const markerObj = markers[editingMarkerIndex];
                markerObj.title = title;
                markerObj.desc = desc;
                markerObj.images = images;
                document.getElementById('marker-info').innerHTML = markerContent(markerObj, editingMarkerIndex);
                editingMarkerIndex = null;
            } else {
                addMarkerToMap(data);
            }
            map.setView([lat, lng], 13);
            document.getElementById('marker-inputs').style.display = 'none';
            document.getElementById('lat').value = '';
            document.getElementById('lng').value = '';
            document.getElementById('marker-title').value = '';
            document.getElementById('marker-desc').value = '';
            document.getElementById('marker-img').value = '';
        });
    } else {
        alert('Please enter valid latitude and longitude values.');
    }
});

// ...existing code...

map.on('click', function(e) {
    document.getElementById('lat').value = e.latlng.lat.toFixed(6);
    document.getElementById('lng').value = e.latlng.lng.toFixed(6);
    document.getElementById('marker-inputs').style.display = 'block';
    editingMarkerIndex = null;
});

// ...existing code...

