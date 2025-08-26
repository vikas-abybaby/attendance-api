import User from '../../models/user.js';
import Helper from '../../utils/index.js';

export const getUsersAnniversary = async () => {
    const { currentDay, currentMonth, currentYear } = Helper.getISTDateParts();
    const today = new Date(currentYear, currentMonth - 1, currentDay);

    return await User.aggregate([
        {
            $addFields: {
                joinDay: { $dayOfMonth: { date: "$joiningDate", timezone: "Asia/Kolkata" } },
                joinMonth: { $month: { date: "$joiningDate", timezone: "Asia/Kolkata" } },
            },
        },
        {
            $addFields: {
                nextAnniversary: {
                    $dateFromParts: {
                        year: currentYear,
                        month: "$joinMonth",
                        day: "$joinDay",
                        timezone: "Asia/Kolkata",
                    },
                },
            },
        },
        {
            $addFields: {
                nextAnniversaryAdjusted: {
                    $cond: [
                        { $lt: ["$nextAnniversary", today] },
                        {
                            $dateFromParts: {
                                year: currentYear + 1,
                                month: "$joinMonth",
                                day: "$joinDay",
                                timezone: "Asia/Kolkata",
                            },
                        },
                        "$nextAnniversary",
                    ],
                },
                isTodayAnniversary: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$joinDay", currentDay] },
                                { $eq: ["$joinMonth", currentMonth] },
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
                isTodayAnniversary: -1,
                nextAnniversaryAdjusted: 1,
            },
        },
        {
            $project: {
                password: 0,
                isTodayAnniversary: 0,
                joinDay: 0,
                joinMonth: 0,
                nextAnniversary: 0,
                nextAnniversaryAdjusted: 0,
            },
        },
    ]);
};