import {
    body,
    param,
    query,
    validationResult
} from 'express-validator';
import {
    error
} from '../utils/response.js';

/**
 * Validation result handler middleware
 * Checks validation results and sends error if validation failed
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value,
            location: err.location
        }));

        return error(res, 400, 'Validation failed', {
            errors: formattedErrors
        });
    }

    next();
};

/**
 * Register validation rules
 */
export const validateRegister = [
    body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({
        min: 3,
        max: 50
    })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({
        min: 6
    })
    .withMessage('Password must be at least 6 characters long'),

    body('firstName')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('First name must be at most 50 characters'),

    body('lastName')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Last name must be at most 50 characters'),

    handleValidationErrors
];

/**
 * Login validation rules
 */
export const validateLogin = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

    body('password')
    .notEmpty()
    .withMessage('Password is required'),

    handleValidationErrors
];

/**
 * Create user validation rules
 */
export const validateCreateUser = [
    body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({
        min: 3,
        max: 50
    })
    .withMessage('Username must be between 3 and 50 characters'),

    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({
        min: 6
    })
    .withMessage('Password must be at least 6 characters long'),

    body('firstName')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('First name must be at most 50 characters'),

    body('lastName')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Last name must be at most 50 characters'),

    body('roleIds')
    .optional()
    .isArray()
    .withMessage('roleIds must be an array')
    .custom((value) => {
        if (value && value.length > 0) {
            return value.every(id => Number.isInteger(id) && id > 0);
        }
        return true;
    })
    .withMessage('roleIds must be an array of positive integers'),

    handleValidationErrors
];

/**
 * Update user validation rules
 */
export const validateUpdateUser = [
    body('username')
    .optional()
    .trim()
    .isLength({
        min: 3,
        max: 50
    })
    .withMessage('Username must be between 3 and 50 characters'),

    body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

    body('firstName')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('First name must be at most 50 characters'),

    body('lastName')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Last name must be at most 50 characters'),

    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

    body('roleIds')
    .optional()
    .isArray()
    .withMessage('roleIds must be an array')
    .custom((value) => {
        if (value && value.length > 0) {
            return value.every(id => Number.isInteger(id) && id > 0);
        }
        return true;
    })
    .withMessage('roleIds must be an array of positive integers'),

    handleValidationErrors
];

/**
 * Create role validation rules
 */
export const validateCreateRole = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({
        min: 2,
        max: 50
    })
    .withMessage('Role name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Role name can only contain letters, numbers, and underscores'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 500
    })
    .withMessage('Description must be at most 500 characters'),

    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

    handleValidationErrors
];

/**
 * Update role validation rules
 */
export const validateUpdateRole = [
    body('name')
    .optional()
    .trim()
    .isLength({
        min: 2,
        max: 50
    })
    .withMessage('Role name must be between 2 and 50 characters'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 500
    })
    .withMessage('Description must be at most 500 characters'),

    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

    handleValidationErrors
];

/**
 * Create permission validation rules
 */
export const validateCreatePermission = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({
        min: 2,
        max: 100
    })
    .withMessage('Permission name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage('Permission name can only contain letters, numbers, dots, hyphens, and underscores'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 500
    })
    .withMessage('Description must be at most 500 characters'),

    body('resource')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Resource must be at most 50 characters'),

    body('action')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Action must be at most 50 characters'),

    handleValidationErrors
];

/**
 * Update permission validation rules
 */
export const validateUpdatePermission = [
    body('name')
    .optional()
    .trim()
    .isLength({
        min: 2,
        max: 100
    })
    .withMessage('Permission name must be between 2 and 100 characters'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 500
    })
    .withMessage('Description must be at most 500 characters'),

    body('resource')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Resource must be at most 50 characters'),

    body('action')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Action must be at most 50 characters'),

    handleValidationErrors
];

/**
 * Assign permissions to role validation
 */
export const validateAssignPermissions = [
    param('id')
    .isInt({
        min: 1
    })
    .withMessage('Role ID must be a positive integer'),

    body('permissionIds')
    .notEmpty()
    .withMessage('permissionIds is required')
    .isArray({
        min: 1
    })
    .withMessage('permissionIds must be a non-empty array')
    .custom((value) => {
        return value.every(id => Number.isInteger(id) && id > 0);
    })
    .withMessage('permissionIds must be an array of positive integers'),

    handleValidationErrors
];

/**
 * Assign role to user validation
 */
export const validateAssignRole = [
    param('roleId')
    .isInt({
        min: 1
    })
    .withMessage('Role ID must be a positive integer'),

    body('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isInt({
        min: 1
    })
    .withMessage('userId must be a positive integer'),

    handleValidationErrors
];

/**
 * ID parameter validation
 */
export const validateId = [
    param('id')
    .isInt({
        min: 1
    })
    .withMessage('ID must be a positive integer'),

    handleValidationErrors
];

/**
 * Pagination query validation
 */
export const validatePagination = [
    query('page')
    .optional()
    .isInt({
        min: 1
    })
    .withMessage('Page must be a positive integer'),

    query('limit')
    .optional()
    .isInt({
        min: 1,
        max: 100
    })
    .withMessage('Limit must be between 1 and 100'),

    handleValidationErrors
];

/**
 * Create company validation rules
 */
export const validateCreateCompany = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({
        min: 2,
        max: 100
    })
    .withMessage('Company name must be between 2 and 100 characters'),

    body('domain')
    .trim()
    .notEmpty()
    .withMessage('Domain is required')
    .isLength({
        min: 3,
        max: 100
    })
    .withMessage('Domain must be between 3 and 100 characters'),

    body('address')
    .optional()
    .trim()
    .isLength({
        max: 255
    })
    .withMessage('Address must be at most 255 characters'),

    body('city')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('City must be at most 100 characters'),

    body('state')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('State must be at most 100 characters'),

    body('country')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('Country must be at most 100 characters'),

    body('postalCode')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Postal code must be at most 20 characters'),

    body('phone')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Phone must be at most 20 characters'),

    body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

    body('website')
    .optional()
    .trim()
    .isURL({
        protocols: ['http', 'https'],
        requireProtocol: false
    })
    .withMessage('Invalid website URL'),

    body('gstNumber')
    .optional()
    .trim()
    .isLength({
        min: 15,
        max: 15
    })
    .withMessage('GST number must be exactly 15 characters'),

    body('panNumber')
    .optional()
    .trim()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage('PAN number must be in format: ABCDE1234F'),

    body('registrationNumber')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Registration number must be at most 50 characters'),

    body('contactPerson')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('Contact person name must be at most 100 characters'),

    body('contactPhone')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Contact phone must be at most 20 characters'),

    body('fax')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Fax must be at most 20 characters'),

    body('industry')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('Industry must be at most 100 characters'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 5000
    })
    .withMessage('Description must be at most 5000 characters'),

    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

    handleValidationErrors
];

/**
 * Update company validation rules
 */
export const validateUpdateCompany = [
    body('name')
    .optional()
    .trim()
    .isLength({
        min: 2,
        max: 100
    })
    .withMessage('Company name must be between 2 and 100 characters'),

    body('domain')
    .optional()
    .trim()
    .isLength({
        min: 3,
        max: 100
    })
    .withMessage('Domain must be between 3 and 100 characters'),

    body('address')
    .optional()
    .trim()
    .isLength({
        max: 255
    })
    .withMessage('Address must be at most 255 characters'),

    body('city')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('City must be at most 100 characters'),

    body('state')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('State must be at most 100 characters'),

    body('country')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('Country must be at most 100 characters'),

    body('postalCode')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Postal code must be at most 20 characters'),

    body('phone')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Phone must be at most 20 characters'),

    body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

    body('website')
    .optional()
    .trim()
    .isURL({
        protocols: ['http', 'https'],
        requireProtocol: false
    })
    .withMessage('Invalid website URL'),

    body('gstNumber')
    .optional()
    .trim()
    .isLength({
        min: 15,
        max: 15
    })
    .withMessage('GST number must be exactly 15 characters'),

    body('panNumber')
    .optional()
    .trim()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage('PAN number must be in format: ABCDE1234F'),

    body('registrationNumber')
    .optional()
    .trim()
    .isLength({
        max: 50
    })
    .withMessage('Registration number must be at most 50 characters'),

    body('contactPerson')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('Contact person name must be at most 100 characters'),

    body('contactPhone')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Contact phone must be at most 20 characters'),

    body('fax')
    .optional()
    .trim()
    .isLength({
        max: 20
    })
    .withMessage('Fax must be at most 20 characters'),

    body('industry')
    .optional()
    .trim()
    .isLength({
        max: 100
    })
    .withMessage('Industry must be at most 100 characters'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 5000
    })
    .withMessage('Description must be at most 5000 characters'),

    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

    handleValidationErrors
];

/**
 * Create department validation rules
 */
export const validateCreateDepartment = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({
        min: 2,
        max: 100
    })
    .withMessage('Department name must be between 2 and 100 characters'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 255
    })
    .withMessage('Description must be at most 255 characters'),

    body('companyId')
    .notEmpty()
    .withMessage('Company ID is required')
    .isInt({
        min: 1
    })
    .withMessage('Company ID must be a positive integer'),

    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

    handleValidationErrors
];

/**
 * Update department validation rules
 */
export const validateUpdateDepartment = [
    body('name')
    .optional()
    .trim()
    .isLength({
        min: 2,
        max: 100
    })
    .withMessage('Department name must be between 2 and 100 characters'),

    body('description')
    .optional()
    .trim()
    .isLength({
        max: 255
    })
    .withMessage('Description must be at most 255 characters'),

    body('companyId')
    .optional()
    .isInt({
        min: 1
    })
    .withMessage('Company ID must be a positive integer'),

    body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

    handleValidationErrors
];

/**
 * Assign users to department validation
 */
export const validateAssignUsersToDepartment = [
    param('id')
    .isInt({
        min: 1
    })
    .withMessage('Department ID must be a positive integer'),

    body('userIds')
    .notEmpty()
    .withMessage('userIds is required')
    .isArray({
        min: 1
    })
    .withMessage('userIds must be a non-empty array')
    .custom((value) => {
        return value.every(id => Number.isInteger(id) && id > 0);
    })
    .withMessage('userIds must be an array of positive integers'),

    handleValidationErrors
];

/**
 * Remove users from department validation
 */
export const validateRemoveUsersFromDepartment = [
    param('id')
    .isInt({
        min: 1
    })
    .withMessage('Department ID must be a positive integer'),

    body('userIds')
    .notEmpty()
    .withMessage('userIds is required')
    .isArray({
        min: 1
    })
    .withMessage('userIds must be a non-empty array')
    .custom((value) => {
        return value.every(id => Number.isInteger(id) && id > 0);
    })
    .withMessage('userIds must be an array of positive integers'),

    handleValidationErrors
];