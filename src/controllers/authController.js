const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');

// const { 
//   sendWelcomeEmail, 
//   sendPasswordResetEmail, 
//   sendPasswordChangedEmail 
// } = require('../utils/email');
const { 
  generateRandomToken, 
  formatResponse 
} = require('../utils/helper');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        $or: [
          { username },
          { email: username },
        ],
      },
    });

    if (!user) {
      return res.status(401).json(
        formatResponse(false, 'Invalid credentials', null, 401)
      );
    }

    // Check if user is active
    // if (!user.isActive) {
    //   return res.status(401).json(
    //     formatResponse(false, 'Account is deactivated. Please contact administrator.', null, 401)
    //   );
    // }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(
        formatResponse(false, 'Invalid credentials', null, 401)
      );
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Update last login
    await user.update({ lastLogin: new Date() });

    res.json(
      formatResponse(true, 'Login successful', {
        user: user.toJSON(),
        token,
        refreshToken,
      })
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      formatResponse(false, 'Login failed', null, 500)
    );
  }
};

module.exports = {
//   register,
  login,
//   forgotPassword,
//   resetPassword,
//   changePassword,
//   getMe,
//   refreshToken,
//   logout,
};