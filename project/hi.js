let mapOptions = {
    center:[52.521256, 4.974516],
    zoom:18
}


let map = new L.map('map' , mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

let marker = new L.Marker([52.521256, 4.974516]);
marker.addTo(map);