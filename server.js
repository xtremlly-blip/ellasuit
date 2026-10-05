const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'testimonials.json');

// Helper to read testimonials safely
const getTestimonials = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// GET Route: Retrieve all testimonials
app.get('/api/testimonials', (req, res) => {
  const testimonials = getTestimonials();
  res.json(testimonials);
});

// POST Route: Save new testimonial
app.post('/api/testimonials', (req, res) => {
  const { name, title, rating, message } = req.body;

  if (!name || !rating || !message) {
    return res.status(400).json({ error: 'Name, rating, and message are required.' });
  }

  const testimonials = getTestimonials();
  const newReview = {
    id: Date.now(),
    name,
    title: title || '',
    rating: parseInt(rating),
    message,
    date: new Date().toLocaleDateString()
  };

  testimonials.unshift(newReview);
  fs.writeFileSync(DATA_FILE, JSON.stringify(testimonials, null, 2));

  res.status(201).json({ success: true, testimonial: newReview });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
