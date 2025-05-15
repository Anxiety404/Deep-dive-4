let mapOptions = {
    center: [52.521256, 4.974516],
    zoom: 18
}


let map = new L.map('map', mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

let marker = new L.Marker([52.521256, 4.974516]);
marker.addTo(map);
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
