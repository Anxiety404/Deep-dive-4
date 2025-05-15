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

const profilesContainer = document.getElementById('profilesContainer');
const profileTemplate = document.getElementById('profileTemplate');

fetch('/api/contacts')
  .then(res => res.json())
  .then(contacts => {
    contacts.forEach(contact => {
      const clone = profileTemplate.content.cloneNode(true);
      clone.querySelector('.name').textContent = contact.name;
      clone.querySelector('.email').textContent = contact.email;
      clone.querySelector('.photo').src = contact.photo ?? '';
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
  const contactForm = document.getElementById('contactForm');


contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const imageData = canvas.toDataURL('image/jpeg', 0.5);

    await fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            photo: imageData
        })
    });
    
});

const logbookEntriesContainer = document.getElementById('logbookEntriesContainer');
const logEntryTemplate = document.getElementById('travelTemplate');

fetch('/api/travel')
  .then(res => res.json())
  .then(entries => {
    entries.forEach(entry => {
      const clone = logEntryTemplate.content.cloneNode(true);
      clone.querySelector('.entry-title').textContent = entry.title;
      clone.querySelector('.entry-date').textContent = entry.date;
      clone.querySelector('.entry-description').textContent = entry.description;
      logbookEntriesContainer.appendChild(clone);
    });
  })
  .catch(err => {
    console.error('Failed to load logbook entries:', err);
  });

  logbookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    await fetch('/api/travel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: formData.get('date'),
            title: formData.get('title'),
            description: formData.get('description')
        })
    });
    
});
  videoElement.srcObject = null;
})