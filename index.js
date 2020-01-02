const babyTracker = require("./babyTracker.js");

exports.handler = async function (event, context, callback) {
    console.log("Received " + event.clickType + " click event from " + event.serialNumber + ".");

    if (event.clickType == "SINGLE") {
        await babyTracker.login(process.env.EMAIL_ADDRESS, process.env.PASSWORD);
        await babyTracker.createWetDiaper("Logged from AWS IoT Button.");
    }
    else if (event.clickType == "DOUBLE") {
        await babyTracker.login(process.env.EMAIL_ADDRESS, process.env.PASSWORD);
        await babyTracker.createDirtyDiaper("Logged from AWS IoT Button.");
    }
}