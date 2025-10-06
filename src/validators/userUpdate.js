import Joi from "joi";

export const userUpdate = Joi.object({
    id: Joi.string()
        .required()
        .messages({
            "string.empty": "UserId is required",
        }),
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must not exceed 100 characters",
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

    profile_url: Joi.string().uri().allow(null, "").messages({
        "string.uri": "Profile picture URL must be a valid URI",
    }),
    status: Joi.string()
        .valid("0", "1")
        .required()
        .messages({
            "any.only": "Status must be 0 or 1",
            "string.empty": "Status is required"
        }),
});
