const Joi = require('joi');
const { BUG_SEVERITY, BUG_STATUS, ROLES } = require('../utils');

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

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    'string.empty': 'Current password is required.',
    'any.required': 'Current password is required.',
  }),
  new_password: Joi.string().min(8).required().messages({
    'string.empty': 'New password is required.',
    'string.min': 'New password must be at least 8 characters long.',
    'any.required': 'New password is required.',
  }),
  confirm_new_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
    'string.empty': 'Confirm new password is required.',
    'any.only': 'Passwords do not match.',
    'any.required': 'Confirm new password is required.',
  }),
});

const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required().messages({
    'string.empty': 'Project name is required.',
    'string.min': 'Project name must be at least 2 characters long.',
    'string.max': 'Project name must not exceed 150 characters.',
    'any.required': 'Project name is required.',
  }),
  description: Joi.string().trim().max(2000).allow('').optional().messages({
    'string.max': 'Description must not exceed 2000 characters.',
  }),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).messages({
    'string.empty': 'Project name cannot be empty.',
    'string.min': 'Project name must be at least 2 characters long.',
    'string.max': 'Project name must not exceed 150 characters.',
  }),
  description: Joi.string().trim().max(2000).allow('').messages({
    'string.max': 'Description must not exceed 2000 characters.',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided to update.',
  });

const addMemberSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
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

const createBugSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Title is required.',
    'string.min': 'Title must be at least 3 characters long.',
    'string.max': 'Title must not exceed 200 characters.',
    'any.required': 'Title is required.',
  }),
  description: Joi.string().trim().min(3).max(5000).required().messages({
    'string.empty': 'Description is required.',
    'string.min': 'Description must be at least 3 characters long.',
    'string.max': 'Description must not exceed 5000 characters.',
    'any.required': 'Description is required.',
  }),
  reproduction_steps: Joi.string().trim().max(5000).allow('').optional().messages({
    'string.max': 'Reproduction steps must not exceed 5000 characters.',
  }),
  severity: Joi.string()
    .valid(...Object.values(BUG_SEVERITY))
    .required()
    .messages({
      'any.only': 'Severity must be one of low, medium, high, or critical.',
      'string.empty': 'Severity is required.',
      'any.required': 'Severity is required.',
    }),
});

const assignBugSchema = Joi.object({
  developer_id: Joi.string().trim().required().messages({
    'string.empty': 'Developer is required.',
    'any.required': 'Developer is required.',
  }),
});

const updateBugStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(BUG_STATUS))
    .required()
    .messages({
      'any.only': 'Invalid status value.',
      'string.empty': 'Status is required.',
      'any.required': 'Status is required.',
    }),
});

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(2000).required().messages({
    'string.empty': 'Comment text is required.',
    'string.max': 'Comment must not exceed 2000 characters.',
    'any.required': 'Comment text is required.',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  requestResetSchema,
  verifyCodeSchema,
  resetPasswordSchema,
  changePasswordSchema,
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  createBugSchema,
  assignBugSchema,
  updateBugStatusSchema,
  createCommentSchema,
};
