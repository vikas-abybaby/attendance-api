export const allValidator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const firstError = error.details[0];

            return res.status(422).json({
                message: firstError.message,
                status_code: 422,
                data: null,
            });
        }

        next();
    };
};
