const getTodayIST = () => {
    // Returns a Date object in IST
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

const getCurrentISTTime = () => {
    // Returns string like "14:32:05"
    return new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

const getISTDateParts = () => {
    const date = getTodayIST();
    return {
        currentDay: date.getDate(),
        currentMonth: date.getMonth() + 1,
        currentYear: date.getFullYear(),
    };
};

export default {
    getTodayIST,
    getCurrentISTTime,
    getISTDateParts,
};
