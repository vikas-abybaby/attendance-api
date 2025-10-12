export const getTodayIST = () => {
    return new Date(new Date().toLocaleString( { timeZone: 'Asia/Kolkata' }));
};

export const getCurrentISTTime = () => {
    return new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const getISTDateParts = () => {
    const date = getTodayIST();
    return {
        currentDay: date.getDate(),
        currentMonth: date.getMonth() + 1,
        currentYear: date.getFullYear(),
    };
};
export const getTodayDate = () => {
    const date = getTodayIST();
    const formattedDate = date.toLocaleDateString('en-CA');
    return formattedDate;
};
