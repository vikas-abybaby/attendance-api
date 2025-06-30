const getTodayIST = () => {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

const getCurrentISTTime = () => {
    const now = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return now; // e.g. "14:35:21"
};
module.exports = { getTodayIST, getCurrentISTTime };
