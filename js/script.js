
// Fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? A day on Venus is longer than a year on Venus!",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second!",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? One million Earths could fit inside the Sun.",
  "Did you know? Space is completely silent—there's no air for sound to travel.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has 95 known moons!",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? A spoonful of a neutron star weighs about a billion tons.",
  "Did you know? The International Space Station travels at 28,000 km/h!"
];

// Pick a random fact and display it above the gallery
const factSection = document.getElementById('space-fact');
if (factSection) {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factSection.textContent = spaceFacts[randomIndex];
}

// Find our date picker inputs, form, and gallery on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const filtersForm = document.querySelector('.filters');
const getImagesBtn = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA API key and endpoint
const API_KEY = 'p9gWvP23jdQ18eeUlVMjT0R20ubhP8EplLWwkEoG';
const API_URL = 'https://api.nasa.gov/planetary/apod';

// Listen for form submit to fetch images (for accessibility)
filtersForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show a loading message
  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🚀</div><p>Loading space images...</p></div>`;

  // Build the API URL with date range
  const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch images from NASA's API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // If only one image is returned, put it in an array
      const images = Array.isArray(data) ? data : [data];

      // Filter out non-image media (e.g., videos)
      const photos = images.filter(item => item.media_type === 'image');

      // If no images, show a message
      if (photos.length === 0) {
        gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">😢</div><p>No images found for this date range.</p></div>`;
        return;
      }

      // Show the images in the gallery
      gallery.innerHTML = '';
      photos.forEach(photo => {
        // Create a div for each image
        const item = document.createElement('div');
        item.className = 'gallery-item';

        // Show the image, title, and date (numbers in DM Mono)
        item.innerHTML = `
          <img src="${photo.url}" alt="${photo.title}" style="cursor:pointer;" />
          <h3>${photo.title}</h3>
          <p><span class="mono-number">${photo.date}</span></p>
        `;

        // Add click event to open modal with details
        item.querySelector('img').addEventListener('click', () => {
          openModal(photo);
        });

        gallery.appendChild(item);
      });
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">❌</div><p>Could not load images. Please try again later.</p></div>`;
      console.error('Error fetching NASA images:', error);
    });
});

// Function to create and show the modal
function openModal(photo) {
  // If modal already exists, remove it first
  const existing = document.getElementById('modal-bg');
  if (existing) existing.remove();

  // Create modal background
  const modalBg = document.createElement('div');
  modalBg.id = 'modal-bg';
  modalBg.className = 'modal-bg';

  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <button class="modal-close" title="Close">&times;</button>
    <img src="${photo.hdurl || photo.url}" alt="${photo.title}" class="modal-img" />
    <h2>${photo.title}</h2>
    <p><strong>Date:</strong> <span class="mono-number">${photo.date}</span></p>
    <p>${highlightNumbers(photo.explanation)}</p>
  `;

  // Add close event
  modal.querySelector('.modal-close').addEventListener('click', () => {
    modalBg.remove();
  });
  // Also close modal when clicking outside the modal content
  modalBg.addEventListener('click', (e) => {
    if (e.target === modalBg) modalBg.remove();
  });

  modalBg.appendChild(modal);
  document.body.appendChild(modalBg);
}

// Helper function to wrap numbers in DM Mono span
function highlightNumbers(text) {
  // This regex matches numbers (including decimals, commas, and years)
  return text.replace(/(\d[\d,.]*)/g, '<span class="mono-number">$1</span>');
}
