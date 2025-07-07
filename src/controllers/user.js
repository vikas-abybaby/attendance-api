import User from '../models/user.js';
import Helper from '../utils/index.js';


const userCalebration = async (req, res) => {
  try {

    const { currentDay, currentMonth, currentYear } = Helper.getISTDateParts();

    const birthday = await User.aggregate([
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

    const anniversary = await User.aggregate([
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

    return res.status(200).json({
      message: "All users Calebrations",
      status_code: 200,
      data: {
        birthday,
        anniversary,
      },
    });
  } catch (err) {
    console.error("Error fetching birthdays/anniversaries:", err);
    return res.status(500).json({
      message: 'Server error',
      status_code: 500,
      data: null,
    });
  }
};

export {
  userProfile,
  userCalebration,
};
