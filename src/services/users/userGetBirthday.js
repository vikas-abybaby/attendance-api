import User from '../../models/user.js';
import Helper from '../../utils/index.js';

export const getUsersBirthday = async () => {

    const { currentDay, currentMonth, currentYear } = Helper.getISTDateParts();
    const today = new Date(currentYear, currentMonth - 1, currentDay);

    return await User.aggregate([
        {
            $addFields: {
                dobDay: { $dayOfMonth: { date: "$dob", timezone: "Asia/Kolkata" } },
                dobMonth: { $month: { date: "$dob", timezone: "Asia/Kolkata" } },
            },
        },
        {
            $addFields: {
                nextBirthday: {
                    $dateFromParts: {
                        year: currentYear,
                        month: "$dobMonth",
                        day: "$dobDay",
                        timezone: "Asia/Kolkata",
                    },
                },
            },
        },
        {
            $addFields: {
                nextBirthdayAdjusted: {
                    $cond: [
                        { $lt: ["$nextBirthday", today] },
                        {
                            $dateFromParts: {
                                year: currentYear + 1,
                                month: "$dobMonth",
                                day: "$dobDay",
                                timezone: "Asia/Kolkata",
                            },
                        },
                        "$nextBirthday",
                    ],
                },
                isTodayBirthday: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$dobDay", currentDay] },
                                { $eq: ["$dobMonth", currentMonth] },
                            ],
                        },
                        1,
                        0,
                    ],
                },
            },
        },
        {
            $sort: {
                isTodayBirthday: -1,
                nextBirthdayAdjusted: 1,
            },
        },
        {
            $project: {
                password: 0,
                isTodayBirthday: 0,
                dobDay: 0,
                dobMonth: 0,
                nextBirthday: 0,
                nextBirthdayAdjusted: 0,
            },
        },
    ]);
};
