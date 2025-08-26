import Joi from 'joi';

export const attendanceUpdate = Joi.object({
  location: Joi.string().required().messages({
    'string.empty': 'Location is required.',
    'any.required': 'Location is required.',
  }),
  lat: Joi.number().required().messages({
    'number.base': 'Latitude must be a number.',
    'any.required': 'Latitude is required.',
  }),
  long: Joi.number().required().messages({
    'number.base': 'Longitude must be a number.',
    'any.required': 'Longitude is required.',
  }),
  absent: Joi.number().optional().messages({
    'number.base': 'Absent must be a number.',
  }),
});
