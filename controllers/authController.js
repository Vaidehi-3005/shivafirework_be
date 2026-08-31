const authService = require('../services/authService');

const login = (req, res) => {
  const { email, password } = req.body;
  const result = authService.loginUser(email, password);

  if (result.success) {
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false, 
      maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
    });

    return res.json({ 
      success: true, 
      token: result.token, 
      message: 'Login successful' 
    });
  }

  return res.status(401).json({ error: result.error });
};

const verifyAuth = (req, res) => {
  res.json({ authenticated: true, user: req.user });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, verifyAuth, logout };