let mapOptions = {
    center:[52.521256, 4.974516],
    zoom:18
}


let map = new L.map('map' , mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

let marker = new L.Marker([52.521256, 4.974516]);
marker.addTo(map);

document.getElementById('btn').addEventListener('click', function() {
    document.getElementById('marker-inputs').style.display = 'block';
});

document.getElementById('close-marker-inputs').addEventListener('click', function() {
    document.getElementById('marker-inputs').style.display = 'none';
});

function addMarker(content, markerData) {
    const marker = L.marker([markerData.lat, markerData.lng]).addTo(map);
    marker.on('click', function() {
        document.getElementById('marker-info').innerHTML = content;
    });
    map.setView([markerData.lat, markerData.lng], 13);
    document.getElementById('marker-inputs').style.display = 'none';
    document.getElementById('lat').value = '';
    document.getElementById('lng').value = '';
    document.getElementById('marker-title').value = '';
    document.getElementById('marker-desc').value = '';
    document.getElementById('marker-img').value = '';
}

document.getElementById('add-marker-btn').addEventListener('click', function() {
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const title = document.getElementById('marker-title').value;
    const desc = document.getElementById('marker-desc').value;
    const imgInput = document.getElementById('marker-img');
    const file = imgInput.files[0];

    if (!isNaN(lat) && !isNaN(lng)) {
        let popupContent = `<strong>${title || 'No title'}</strong><br>`;
        const markerData = { lat, lng };

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                popupContent += `<img src="${e.target.result}" alt="marker image" style="max-width:100px;display:block;"><br>`;
                popupContent += `<span>${desc || ''}</span>`;
                addMarker(popupContent, markerData);
            };
            reader.readAsDataURL(file);
        } else {
            popupContent += `<span>${desc || ''}</span>`;
            addMarker(popupContent, markerData);
        }
    } else {
        alert('Please enter valid latitude and longitude values.');
    }
});