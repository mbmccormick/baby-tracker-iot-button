const babyTracker = require("./babyTracker.js");

exports.handler = async function (event, context, callback) {
    console.log("Received event:");
    console.log(event);

    if (event.clickType == "SINGLE") {
        await babyTracker.login(process.env.EMAIL_ADDRESS, process.env.PASSWORD, process.env.DEVICE_UUID);
        await babyTracker.createWetDiaper("Logged from AWS IoT Button.");
    }
    else if (event.clickType == "DOUBLE") {
        await babyTracker.login(process.env.EMAIL_ADDRESS, process.env.PASSWORD, process.env.DEVICE_UUID);
        await babyTracker.createDirtyDiaper("Logged from AWS IoT Button.");
    }
    else if (event.clickType == "LONG") {
        await babyTracker.login(process.env.EMAIL_ADDRESS, process.env.PASSWORD, process.env.DEVICE_UUID);
        await babyTracker.createMixedDiaper("Logged from AWS IoT Button.");
    }

    console.log("Completed.");
};