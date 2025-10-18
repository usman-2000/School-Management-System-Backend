const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail
} = require('../utils/email');
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

// Register user
const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role = 'student',
      phone,
      dateOfBirth,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json(
        formatResponse(false, 'User with this email or username already exists', null, 400)
      );
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      dateOfBirth,
      address,
      verificationToken: generateRandomToken(),
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    res.status(201).json(
      formatResponse(true, 'User registered successfully', {
        user: user.toJSON(),
        token,
        refreshToken,
      }, 201)
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(
      formatResponse(false, 'Registration failed', null, 500)
    );
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        username,
        // email: username
        // password

      },
    });

    console.log("user", user);

    if (!user) {
      return res.status(401).json(
        formatResponse(false, 'Invalid credentials', null, 401)
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json(
        formatResponse(false, 'Account is deactivated. Please contact administrator.', null, 401)
      );
    }
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    console.log("PASSOWRD ", isPasswordValid)
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

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json(
        formatResponse(false, 'No user found with this email address', null, 404)
      );
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token
    await user.update({
      passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
      passwordResetExpires,
    });

    // Send email
    try {
      await sendPasswordResetEmail(user, resetToken);

      res.json(
        formatResponse(true, 'Password reset email sent successfully')
      );
    } catch (emailError) {
      // Reset the fields if email fails
      await user.update({
        passwordResetToken: null,
        passwordResetExpires: null,
      });

      console.error('Email sending failed:', emailError);
      return res.status(500).json(
        formatResponse(false, 'Error sending password reset email', null, 500)
      );
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to process password reset request', null, 500)
    );
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          $gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json(
        formatResponse(false, 'Invalid or expired reset token', null, 400)
      );
    }

    // Update password and clear reset fields
    await user.update({
      password,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(user);
    } catch (emailError) {
      console.error('Failed to send password changed email:', emailError);
    }

    // Generate new tokens
    const authToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json(
      formatResponse(true, 'Password reset successfully', {
        user: user.toJSON(),
        token: authToken,
        refreshToken,
      })
    );
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json(
      formatResponse(false, 'Password reset failed', null, 500)
    );
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json(
        formatResponse(false, 'User not found', null, 404)
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        formatResponse(false, 'Current password is incorrect', null, 400)
      );
    }

    // Update password
    await user.update({ password: newPassword });

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(user);
    } catch (emailError) {
      console.error('Failed to send password changed email:', emailError);
    }

    res.json(
      formatResponse(true, 'Password changed successfully')
    );
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(
      formatResponse(false, 'Password change failed', null, 500)
    );
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    res.json(
      formatResponse(true, 'User data retrieved successfully', { user })
    );
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve user data', null, 500)
    );
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json(
        formatResponse(false, 'Refresh token is required', null, 401)
      );
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json(
        formatResponse(false, 'Invalid refresh token', null, 401)
      );
    }

    // Generate new tokens
    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json(
      formatResponse(true, 'Tokens refreshed successfully', {
        token: newToken,
        refreshToken: newRefreshToken,
      })
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json(
      formatResponse(false, 'Invalid refresh token', null, 401)
    );
  }
};

// Logout (client-side mainly, but can be used to blacklist tokens if needed)
const logout = async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json(
      formatResponse(true, 'Logout successful')
    );
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json(
      formatResponse(false, 'Logout failed', null, 500)
    );
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  refreshToken,
  logout,
};