function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    window.location.href = 'https://www.openstreetmap.org/#map=18/' + latitude + '/' + longitude;
  }
  function geoFindMe() {
    const status = document.queryselector("#status");
    const mapLink = document.querySelector("#map-link");
    const accuracy = position.coords.accuracy;
  }
  

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.querySelector("#find-me").addEventListener("click", geoFindMe);
