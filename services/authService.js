const jwt = require('jsonwebtoken');

const ADMIN_EMAIL = 'super@123.com';
const ADMIN_PASS = 'superadmin';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const loginUser = (email, password) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ email, role: 'superadmin' }, JWT_SECRET, { expiresIn: '10d' });
    return { success: true, token };
  }
  return { success: false, error: 'Invalid email or password.' };
};

module.exports = { loginUser };