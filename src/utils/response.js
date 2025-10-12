export const success = (data = null, message = 'Success', status = 200) => ({
    success: true,
    status,
    message,
    data,
});

export const error = (data = null, message = 'Error', status = 400,) => ({
    success: false,
    status,
    message,
    data,
});
