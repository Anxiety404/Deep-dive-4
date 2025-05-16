let mapOptions = {
    center:[52.5196361, 4.9746193],
    zoom:18
}


let map = new L.map('map' , mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

document.getElementById('markerinput').addEventListener('click', function() {
    const markerInputs = document.getElementById('marker-inputs');
    markerInputs.style.display = markerInputs.style.display === 'none' ? 'block' : 'none';
});
document.getElementById('camera').addEventListener('click', () => {
    location.replace("index.html");
})
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
    const files = imgInput.files;

    if (!isNaN(lat) && !isNaN(lng)) {
        let popupContent = `<strong>${title || 'No title'}</strong><br>`;
        const markerData = { lat, lng, title, desc, images: [] };

        if (files && files.length > 0) {
            let imagesHTML = '';
            let loadedImages = 0;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagesHTML += `<img src="${e.target.result}" alt="marker image" style="max-width:100px;display:block;"><br>`;
                    markerData.images.push(e.target.result);
                    loadedImages++;
                    if (loadedImages === files.length) {
                        popupContent += imagesHTML;
                        popupContent += `<span>${desc || ''}</span>`;
                        addMarker(popupContent, markerData);
                    }
                };
                reader.readAsDataURL(files[i]);
            }
        } else {
            popupContent += `<span>${desc || ''}</span>`;
            addMarker(popupContent, markerData);
        }
    } else {
        alert('Please enter valid latitude and longitude values.');
    }
});

let markerPositions = [];
let stripedLine = null;

function addMarker(content, markerData) {
    const marker = L.marker([markerData.lat, markerData.lng]).addTo(map);
    marker.on('click', function() {
        document.getElementById('marker-info').innerHTML = content;
    });
    map.setView([markerData.lat, markerData.lng], 13);

    markerPositions.push([markerData.lat, markerData.lng]);
    drawStripedLine();

    document.getElementById('marker-inputs').style.display = 'none';
    document.getElementById('lat').value = '';
    document.getElementById('lng').value = '';
    document.getElementById('marker-title').value = '';
    document.getElementById('marker-desc').value = '';
    document.getElementById('marker-img').value = '';
}

function drawStripedLine() {
    if (stripedLine) {
        map.removeLayer(stripedLine);
    }
    if (markerPositions.length < 2) return;

    stripedLine = L.polyline(markerPositions, {
        color: 'black',
        weight: 6,
        opacity: 1,
        dashArray: '20, 20',
        lineCap: 'butt'
    }).addTo(map);

    L.polyline(markerPositions, {
        color: 'white',
        weight: 6,
        opacity: 1,
        dashArray: '0, 20, 20, 0',
        lineCap: 'butt'
    }).addTo(map);
}

let markers = [];

function addMarker(content, markerData) {
    const marker = L.marker([markerData.lat, markerData.lng]).addTo(map);
    markers.push({ marker, markerData });

    marker.on('click', function() {
        let imagesHTML = '';
        if (markerData.images && markerData.images.length) {
            imagesHTML = markerData.images.map(img =>
                `<img src="${img}" alt="marker image" style="max-width:100px;display:block;"><br>`
            ).join('');
        }
        document.getElementById('marker-info').innerHTML = `
            <strong>${markerData.title || 'No title'}</strong><br>
            ${imagesHTML}
            <span>${markerData.desc || ''}</span><br>
            <button id="edit-marker-btn" style="margin-top:10px;">Edit</button>
        `;

        document.getElementById('edit-marker-btn').onclick = function() {
            document.getElementById('lat').value = markerData.lat;
            document.getElementById('lng').value = markerData.lng;
            document.getElementById('marker-title').value = markerData.title || '';
            document.getElementById('marker-desc').value = markerData.desc || '';
            document.getElementById('marker-inputs').style.display = 'block';

            const idx = markers.findIndex(m => m.marker === marker);
            if (idx !== -1) {
                map.removeLayer(markers[idx].marker);
                markers.splice(idx, 1);
                markerPositions.splice(idx, 1);
                drawStripedLine();
            }
        };
    });

    map.setView([markerData.lat, markerData.lng], 13);
    markerPositions.push([markerData.lat, markerData.lng]);
    drawStripedLine();

    document.getElementById('marker-inputs').style.display = 'none';
    document.getElementById('lat').value = '';
    document.getElementById('lng').value = '';
    document.getElementById('marker-title').value = '';
    document.getElementById('marker-desc').value = '';
    document.getElementById('marker-img').value = '';
}
const blogpage = document.querySelector(".blogpage")
const header = document.querySelector(".header")
const arrow = document.getElementById("arrow")
arrow.addEventListener("click", () => {
    if (blogpage.style.background != "white") {
        blogpage.style.background = "white"
        blogpage.style.height = "50vh"
        blogpage.style.display = "flex"
        blogpage.style.justifyContent = "space-between"
        blogpage.style.flexDirection = "column"
        header.style.display = "block"
        header.style.padding = "15px"
        arrow.style.color = "black"
        arrow.style.transform = "rotate(270deg)"
    } else {
        blogpage.style.background = "linear-gradient(to bottom, #77777700 50%, #000000 100%)"
        blogpage.style.height = "25vh"
        blogpage.style.display = "block"
        header.style.display = "none"
        header.style.padding = "0px"
        arrow.style.color = "white"
        arrow.style.transform = "rotate(90deg)"
    }

})