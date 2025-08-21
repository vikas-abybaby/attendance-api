// Add new activity into an existing array
const addActivityLog = (currentActivity, { lat, long, time }) => {
    let activity = Array.isArray(currentActivity) ? currentActivity : [];

    activity.push({
        lat: lat?.toString(),
        long: long?.toString(),
        time: time,
    });

    return activity;
};

export default  { addActivityLog };
