console.log('javascript loaded');

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

import Camera from 'camera';

const camera = new Camera();
const videoElement = document.getElementById('cameraFeed');
const startButton = document.getElementById('startCamera');
const stopButton = document.getElementById('stopCamera');

startButton.addEventListener('click', async () => {
    videoElement.srcObject = await camera.getStream();
    videoElement.play();
});

stopButton.addEventListener('click', () => {
    camera.stopStream();
    videoElement.srcObject = null;
});

// Get DOM elements
const takePhotoButton = document.getElementById('takePhoto');
const canvas = document.getElementById('photoCanvas');
const context = canvas.getContext('2d');

// Capture and store image
takePhotoButton.addEventListener('click', () => {
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Save canvas content as image in localStorage
    const imageData = canvas.toDataURL('image/png');
    localStorage.setItem('savedPhoto', imageData);
});

// Function to draw image to canvas
const drawImage = async (imageData) => {
    try {
        const img = new Image();
        img.src = imageData;
        await img.decode(); // Waits for the image to be decoded
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (err) {
        console.error("Error decoding or drawing image:", err);
    }
};

// On page load, restore image if available
const savedImage = localStorage.getItem('savedPhoto');
if (savedImage) {
    drawImage(savedImage);
}

// script.js

const logbookEntriesContainer = document.getElementById('logbookEntriesContainer');
const logEntryTemplate        = document.getElementById('travelTemplate');
const logbookForm            = document.getElementById('logbookForm');

// **match your HTML IDs**
const latitudeInput  = document.getElementById('lat');
const longitudeInput = document.getElementById('lng');

const clearButton    = document.getElementById('clearForm');
const dateInput      = document.getElementById('entryDate');
const titleInput     = document.getElementById('entryTitle');
const descriptionInput = document.getElementById('entryDescription');

const findMeButton   = document.getElementById('find-me');
const statusEl       = document.getElementById('status');
const mapLink        = document.getElementById('map-link');

// 1) Render stored entries
async function loadEntries() {
  logbookEntriesContainer.innerHTML = '';
  const res     = await fetch('/api/travel');
  const entries = await res.json();

  entries.forEach(entry => {
    const clone = logEntryTemplate.content.cloneNode(true);
    clone.querySelector('.entry-title').textContent       = entry.title;
    clone.querySelector('.entry-date').textContent        = new Date(entry.date).toLocaleDateString();
    clone.querySelector('.entry-description').textContent = entry.description;

    const imgEl = clone.querySelector('.entry-photo');
  if (entry.image) {
    imgEl.src           = entry.image;      // your base64 data URL
    imgEl.style.display = 'block';          // make it visible
  }

    if (entry.latitude != null && entry.longitude != null) {
      const coordEl = document.createElement('p');
      coordEl.classList.add('entry-coords');
      coordEl.textContent = `📍 ${entry.latitude.toFixed(5)}, ${entry.longitude.toFixed(5)}`;
      clone.querySelector('.entry-description').after(coordEl);
    }

    const deleteButton = clone.querySelector('.delete-btn');
    deleteButton.setAttribute('data-id', entry._id);
    deleteButton.addEventListener('click', async () => {
      const id = deleteButton.dataset.id;
      const del = await fetch(`/api/travel/${id}`, { method: 'DELETE' });
      if (del.ok) clone.querySelector('.travel').remove();
      else alert('Failed to delete travel entry');
    });

    logbookEntriesContainer.appendChild(clone);
  });
}

// 2) “Show my location” button populates the lat/lng inputs
function geoFindMe() {
  statusEl.textContent = 'Locating…';
  mapLink.href = '';
  mapLink.textContent = '';

  if (!navigator.geolocation) {
    statusEl.textContent = 'Geolocation not supported';
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    statusEl.textContent = '';
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude.toFixed(5)}°, Longitude: ${longitude.toFixed(5)}°`;

    // *** write into YOUR form inputs ***
    latitudeInput.value  = latitude;
    longitudeInput.value = longitude;
  }, () => {
    statusEl.textContent = 'Unable to retrieve your location';
  });
}
findMeButton.addEventListener('click', geoFindMe);

// 3) Submit handler
logbookForm.addEventListener('submit', event => {
  event.preventDefault();

  // grab them by the correct name/id
  const formData = new FormData(logbookForm);
  const payload = {
    date:        formData.get('date'),
    title:       formData.get('title'),
    description: formData.get('description'),
    latitude:    parseFloat(formData.get('lat')) || null,
    longitude:   parseFloat(formData.get('lng')) || null,
     image:       localStorage.getItem('savedPhoto')
  };

  // If the user never clicked “Show my location” (fields blank),
  // try geolocation again one last time before sending.
  const needGeo = payload.latitude === null || payload.longitude === null;

  const doPost = async () => {
    const res = await fetch('/api/travel', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    if (res.ok) {
      logbookForm.reset();
      dateInput.value = getTodayDate();
      loadEntries();
    } else {
      alert('Failed to add new travel entry');
    }
  };

  if (needGeo) {
    navigator.geolocation.getCurrentPosition(pos => {
      payload.latitude  = pos.coords.latitude;
      payload.longitude = pos.coords.longitude;
      latitudeInput.value  = payload.latitude;
      longitudeInput.value = payload.longitude;
      doPost();
    }, () => {
      // still post whatever you've got (even nulls)
      doPost();
    });
  } else {
    doPost();
  }
});

// 4) Helpers & clear form
function getTodayDate() {
  const t = new Date();
  return [ t.getFullYear(),
           String(t.getMonth()+1).padStart(2,'0'),
           String(t.getDate()).padStart(2,'0') ].join('-');
}

dateInput.value = getTodayDate();
clearButton.addEventListener('click', () => {
  titleInput.value        = '';
  descriptionInput.value  = '';
  dateInput.value         = getTodayDate();
  latitudeInput.value     = '';
  longitudeInput.value    = '';
  statusEl.textContent    = '';
  mapLink.href            = '';
  mapLink.textContent     = '';
});

// initial load
loadEntries().catch(err => console.error('Failed to load entries:', err));
