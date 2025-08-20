export const attendanceMy = async (req, res) => {
    res.status(201).json({
        message: 'attendanceAdd successfully',
        status_code: 201,
        data: "newUser",
    });
}