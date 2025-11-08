
export function success(res, data = null, message = 'Success', status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
}

export function error(res, message = 'Server Error', status = 500, data = null) {
    return res.status(status).json({
        success: false,
        message,
        data,
    });
}
