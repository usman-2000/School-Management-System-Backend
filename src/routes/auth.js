const express = require('express');
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  refreshToken,
  logout,
} = require('../controllers/authController');

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  validate,
} = require('../validators/authValidator');

const { authenticateToken } = require('../middleware/auth');

router.post('/login', loginValidation, validate, login);

module.exports = router;