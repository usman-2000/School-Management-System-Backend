const { body,validationResult} = require("express-validator")

// Validation rules for login

const loginValidation = [
    body('username').notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    
]

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
//   registerValidation,
  loginValidation,
//   forgotPasswordValidation,
//   resetPasswordValidation,
//   changePasswordValidation,
  validate,
};