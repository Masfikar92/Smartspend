const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./src/config/passport');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const authGoogleRoutes = require('./src/routes/authGoogle');
const transactionRoutes = require('./src/routes/transactions');
const savingRoutes = require('./src/routes/savings');
const userRoutes = require('./src/routes/user');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/auth', authGoogleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings', savingRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SmartSpend API berjalan!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});