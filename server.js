const API_URL = 'https://ellasuit-api.onrender.com/api/testimonials';

let selectedRating = 5; // Default star rating

// 1. Fetch existing testimonials on load
document.addEventListener('DOMContentLoaded', () => {
  fetchTestimonials();
  setupStarRating();
});

// Star selection UI handler
function setupStarRating() {
  const stars = document.querySelectorAll('.star-opt');
  const display = document.getElementById('rating-value-display');

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-rating'));
      if (display) display.textContent = `${selectedRating} Star${selectedRating > 1 ? 's' : ''}`;
      
      // Update star visuals
      stars.forEach((s, idx) => {
        if (idx < selectedRating) {
          s.classList.remove('fa-regular');
          s.classList.add('fa-solid');
        } else {
          s.classList.remove('fa-solid');
          s.classList.add('fa-regular');
        }
      });
    });
  });
}

// Fetch and render saved reviews
async function fetchTestimonials() {
  try {
    const response = await fetch(API_URL);
    const testimonials = await response.json();
    
    // Looks for your review grid container
    const container = document.getElementById('testimonial-list'); 
    if (!container) return;
    
    container.innerHTML = ''; 

    testimonials.forEach(item => {
      const starsHtml = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
      const card = document.createElement('div');
      card.className = "bg-charcoal p-6 rounded-sm border border-darkslate text-cream space-y-3";
      card.innerHTML = `
        <div class="text-gold text-sm">${starsHtml}</div>
        <p class="text-xs text-cream/90 italic font-light">"${item.message}"</p>
        <div class="text-[11px] text-cream/60 flex justify-between items-center pt-2 border-t border-darkslate/50">
            <div>
              <span class="font-bold text-cream block">${item.name}</span>
              <span class="text-[10px] text-softgrey">${item.title || ''}</span>
            </div>
            <span>${item.date}</span>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
  }
}

// Submit handler mapped directly to your form inputs
const testimonialForm = document.getElementById('testimonial-form');
if (testimonialForm) {
  testimonialForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('review-name');
    const titleInput = document.getElementById('review-title');
    const messageInput = document.getElementById('review-text');

    const payload = {
      name: nameInput.value,
      title: titleInput.value,
      rating: selectedRating,
      message: messageInput.value
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        testimonialForm.reset();
        selectedRating = 5; // Reset stars back to 5
        if (document.getElementById('rating-value-display')) {
          document.getElementById('rating-value-display').textContent = '5 Stars';
        }
        fetchTestimonials(); // Refresh live feed on screen
      } else {
        alert('Could not submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting testimonial:', err);
    }
  });
}
