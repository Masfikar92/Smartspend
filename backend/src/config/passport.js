const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models/db');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const full_name = profile.displayName;
    const google_id = profile.id;
    const avatar = profile.photos[0]?.value;

    // Cek apakah user sudah ada
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    if (existing.length > 0) {
      // User sudah ada, update google_id kalau belum ada
      if (!existing[0].google_id) {
        await db.query(
          'UPDATE users SET google_id = ?, avatar = ? WHERE email = ?',
          [google_id, avatar, email]
        );
      }
      return done(null, existing[0]);
    }

    // User baru, simpan ke database
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, google_id, avatar) VALUES (?, ?, ?, ?)',
      [full_name, email, google_id, avatar]
    );

    const [newUser] = await db.query(
      'SELECT * FROM users WHERE id = ?', [result.insertId]
    );

    return done(null, newUser[0]);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, users[0]);
});

module.exports = passport;