import Joi from "joi";

export const userCreate = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must not exceed 100 characters",
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password must not exceed 100 characters",
        }),

    dob: Joi.date()
        .required()
        .messages({
            "any.required": "Date of birth is required",
            "date.base": "Date of birth must be a valid date",
        }),

    age: Joi.number()
        .integer()
        .min(18)
        .max(100)
        .optional()
        .messages({
            "number.base": "Age must be a number",
            "number.min": "Age must be at least 18",
            "number.max": "Age must not exceed 100",
        }),

    gender: Joi.string()
        .valid("male", "female", "other")
        .required()
        .messages({
            "any.required": "Gender is required",
            "any.only": "Gender must be male, female, or other",
        }),

    role: Joi.string()
        .valid("admin", "manager", "employee", "hr")
        .default("employee")
        .messages({
            "any.only": "Role must be one of: admin, manager, employee, hr",
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .messages({
            "string.pattern.base": "Phone must be 10 to 15 digits",
        }),

    address: Joi.string().max(255).optional(),

    department: Joi.string().optional(),
    designation: Joi.string().optional(),
    employeeId: Joi.string().optional(),

    createdBy: Joi.number().optional().allow(null),
    reportingTo: Joi.number().optional().allow(null),

    platform: Joi.string()
        .valid("android", "ios", "web")
        .optional()
        .messages({
            "any.only": "Platform must be android, ios, or web",
        }),

    profilePicUrl: Joi.string().uri().optional().messages({
        "string.uri": "Profile picture URL must be a valid URI",
    }),
});
