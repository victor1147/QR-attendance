const express = require('express');
const router = express.Router();

// Example GET route
router.get('/', (req, res) => {
  res.json({ message: 'All students fetched successfully!' });
});

// Example POST route
router.post('/', (req, res) => {
  const newStudent = req.body;  // You’ll need express.json() middleware
  res.json({ message: 'New student added', student: newStudent });
});

module.exports = router;
