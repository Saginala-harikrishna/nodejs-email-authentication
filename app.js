const express = require('express');
const path = require('path');
const app = express();

// Middleware to serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root URL to login.html (no need to include 'public' in the path)
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
