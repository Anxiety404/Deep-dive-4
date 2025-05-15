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

const profilesContainer = document.getElementById('profilesContainer');
const profileTemplate = document.getElementById('profileTemplate');

fetch('/api/contacts')
  .then(res => res.json())
  .then(contacts => {
    contacts.forEach(contact => {
      const clone = profileTemplate.content.cloneNode(true);
      clone.querySelector('.name').textContent = contact.name;
      clone.querySelector('.email').textContent = contact.email;
      clone.querySelector('.photo').src = contact.photo ?? ''; // fallback to empty if none
      profilesContainer.appendChild(clone);
    });
  })
  .catch(err => {
    console.error('Failed to load contacts:', err);
  });

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
const logbookForm = document.getElementById('logbookForm');

fetch('/api/travel')
  .then(res => res.json())
  .then(entries => {
    entries.forEach(entry => {
      const clone = logEntryTemplate.content.cloneNode(true);

      clone.querySelector('.entry-title').textContent = entry.title;
      clone.querySelector('.entry-date').textContent = new Date(entry.date).toLocaleDateString();
      clone.querySelector('.entry-description').textContent = entry.description;

      // Set the data-id for deletion
      const deleteButton = clone.querySelector('.delete-btn');
      deleteButton.setAttribute('data-id', entry._id);

      // Add delete handler
      deleteButton.addEventListener('click', async () => {
        const id = deleteButton.getAttribute('data-id');
        const response = await fetch(`/api/travel/${id}`, { method: 'DELETE' });

        if (response.ok) {
          deleteButton.closest('.travel').remove(); // Remove from DOM
        } else {
          alert('Failed to delete travel entry');
        }
      });

      logbookEntriesContainer.appendChild(clone);
    });
  })
  .catch(err => {
    console.error('Failed to load logbook entries:', err);
  });


const clearButton = document.getElementById('clearForm');
const dateInput = document.getElementById('entryDate');
const titleInput = document.getElementById('entryTitle');
const descriptionInput = document.getElementById('entryDescription');

// Function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Set default date on page load
dateInput.value = getTodayDate();

// Clear form on button click
clearButton.addEventListener('click', () => {
  titleInput.value = '';
  descriptionInput.value = '';
  dateInput.value = getTodayDate(); // Reset to today's date
});