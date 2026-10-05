const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'testimonials.json');

// Helper to read testimonials
const getTestimonials = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

// GET Route: Retrieve all testimonials for public display
app.get('/api/testimonials', (req, res) => {
  const testimonials = getTestimonials();
  res.json(testimonials);
});

// POST Route: Submit a new testimonial
app.post('/api/testimonials', (req, res) => {
  const { name, rating, message } = req.body;

  if (!name || !rating || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const testimonials = getTestimonials();
  const newReview = {
    id: Date.now(),
    name,
    rating: parseInt(rating),
    message,
    date: new Date().toLocaleDateString()
  };

  testimonials.unshift(newReview); // Add newest first
  fs.writeFileSync(DATA_FILE, JSON.stringify(testimonials, null, 2));

  res.status(201).json({ success: true, testimonial: newReview });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
