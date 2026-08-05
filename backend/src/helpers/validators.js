const Joi = require('joi');
const { ROLES } = require('../utils');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 2 characters long.',
    'string.max': 'Name must not exceed 100 characters.',
    'any.required': 'Name is required.',
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      'any.only': 'Role must be either qa_engineer or developer.',
      'string.empty': 'Role is required.',
      'any.required': 'Role is required.',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
});

const requestResetSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
});

const verifyCodeSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  code: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'Code is required.',
      'string.length': 'Code must be 6 digits.',
      'string.pattern.base': 'Code must contain only digits.',
      'any.required': 'Code is required.',
    }),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  code: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'Code is required.',
      'string.length': 'Code must be 6 digits.',
      'string.pattern.base': 'Code must contain only digits.',
      'any.required': 'Code is required.',
    }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  requestResetSchema,
  verifyCodeSchema,
  resetPasswordSchema,
};
