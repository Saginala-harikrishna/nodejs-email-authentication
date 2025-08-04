const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
