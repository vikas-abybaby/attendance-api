const User = require('../models/user'); // Ensure User model is imported

const getHome = async (req, res) => {
    try {
        const users = await User.find({});

        const totalUsers = users.length;

        // Optionally filter for today's attendance, birthdays, work anniversaries
        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        const totalBirthdays = users.filter(user => {
            const dob = new Date(user.dob);
            return dob.getDate() === todayDate && dob.getMonth() === todayMonth;
        }).length;

        const totalWorkAnniversaries = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt.getDate() === todayDate && createdAt.getMonth() === todayMonth;
        }).length;

        // You can replace this with actual attendance logic if you have one
        const totalAttendanceToday = 8;

        return res.status(200).json({
            status_code: 200,
            message: 'Dashboard data fetched successfully',
            data: [
                { count: totalUsers, title: "Total Users", routes: "user_screen" },
                { count: totalAttendanceToday, title: "Total attendance for today", routes: "attendance_screen" },
                { count: totalBirthdays, title: "Total birthdays today", routes: "birthday_screen" },
                { count: totalWorkAnniversaries, title: "Total work anniversaries today", routes: "anniversary_screen" },
            ]
        });

    } catch (error) {
        console.error("Error fetching home dashboard:", error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

module.exports = {
    getHome,
};
