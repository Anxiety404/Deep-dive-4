console.log('javascript loaded');
import Camera from 'camera';
// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

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

const takePhotoButton = document.getElementById('takePhoto');
const canvas = document.getElementById('photoCanvas');
const context = canvas.getContext('2d');

takePhotoButton.addEventListener('click', () => {
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    localStorage.setItem('savedPhoto', imageData);
});

const drawImage = async (imageData) => {
    try {
        const img = new Image();
        img.src = imageData;
        await img.decode(); 
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (err) {
        console.error("Error decoding or drawing image:", err);
    }
};

const savedImage = localStorage.getItem('savedPhoto');
if (savedImage) {
    drawImage(savedImage);
}

const profilesContainer = document.getElementById('profilesContainer');
const profileTemplate = document.getElementById('profileTemplate');

fetch('/api/contacts')
  .then(res => res.json())
  .then(contacts => {
    contacts.forEach(contact => {
      const clone = profileTemplate.content.cloneNode(true);
      clone.querySelector('.name').textContent = contact.name;
      clone.querySelector('.email').textContent = contact.email;
      profilesContainer.appendChild(clone);
    });
  })
  .catch(err => {
    console.error('Failed to load contacts:', err);
  });
const switchButton = document.getElementById('switchCamera');

switchButton.addEventListener('click', async () => {
  try {
    const stream = await camera.switchCamera();
    videoElement.srcObject = stream;
  } catch (err) {
    console.error('Error switching camera:', err);
  }
});

document.getElementById('back-to-map-btn').addEventListener('click', function() {
    window.location.href = 'hi.html';
});