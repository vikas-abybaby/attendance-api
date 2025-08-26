import Joi from "joi";

export const roomCreate = Joi.object({
    name: Joi.string().min(3).max(255).required().messages({
        "string.base": "Room name must be a text",
        "string.empty": "Room name is required",
        "string.min": "Room name must be at least 3 characters long",
        "string.max": "Room name cannot exceed 255 characters",
        "any.required": "Room name is required",
    }),
    description: Joi.string().allow(null, "").max(1000).messages({
        "string.max": "Description cannot exceed 1000 characters",
    }),
    avatar_url: Joi.string().uri().allow(null, "").messages({
        "string.uri": "Avatar URL must be a valid URL",
    }),
    is_group: Joi.boolean().default(true),
    is_active: Joi.boolean().default(true),
});
