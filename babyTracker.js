const request = require("request");
const moment = require("moment-timezone");
const uuidv4 = require("uuid/v4");

const DeviceName = "Node.js";
const DeviceOSInfo = "Node.js 1.0.0";
const DeviceUUID = "34f27354-6b5a-4823-ba58-6421eca58daf";

moment.tz.setDefault("America/Los_Angeles");

exports.login = async function(username, password) {
    console.log("Logging in to Baby Tracker service.");

    return new Promise((resolve, reject) => {
        request({
            method: "POST",
            url: "https://prodapp.babytrackers.com/session",
            json: {
                "AppInfo": {
                    "AccountType": 0,
                    "AppType": 0
                },
                "Device": {
                    "DeviceName": DeviceName,
                    "DeviceOSInfo": DeviceOSInfo,
                    "DeviceUUID": DeviceUUID
                },
                "EmailAddress": username,
                "Password": password
            },
            jar: true
        },
        function (err, response, body) {
            if (err) {
                console.log("ERROR: " + err);
                
                reject(err);
            }

            console.log("Login succeeded.");

            resolve();
        });
    });
}

async function getDevices() {
    console.log("Fetching devices from Baby Tracker service.");

    return new Promise((resolve, reject) => {
        request({
            method: "GET",
            url: "https://prodapp.babytrackers.com/account/device",
            jar: true
        },
        function (err, response, body) {
            if (err) {
                console.log("ERROR: " + err);
                
                reject(err);
            }
        
            var data = JSON.parse(body);

            console.log("Fetch devices succeeded.");

            resolve(data);
        });
    });
}

async function getLatestTransactionForDevice(device) {
    console.log("Fetching transactions for " + device.DeviceUUID + " from Baby Tracker service.");

    return new Promise((resolve, reject) => {
        request({
            method: "GET",
            url: "https://prodapp.babytrackers.com/account/transaction/" + device.DeviceUUID + "/" + (device.LastSyncID - 1),
            jar: true
        },
        function (err, response, body) {
            if (err) {
                console.log("ERROR: " + err);
                
                reject(err);
            }
        
            var data = JSON.parse(body);

            var transaction = Buffer.from(data[0].Transaction, "base64").toString("ascii");

            console.log("Fetch transactions succeeded.");

            resolve(transaction);
        });
    });
}

async function getLatestBabyObject() {
    console.log("Fetching latest baby object from Baby Tracker service.");

    var devices = await getDevices();

    var transactions = [];
    for (var i = 0; i < devices.length; i++) {
        var transaction = await getLatestTransactionForDevice(devices[i]);
        transactions.push(transaction);
    }

    var babyObject = null;
    var latestTimestamp = moment("1970-01-01");

    for (var i = 0; i < transactions.length; i++) {
        var transaction = JSON.parse(transactions[i]);
        var timestamp = moment(transaction.timestamp, "YYYY-MM-DD HH:mm:ss ZZ");

        if (timestamp > latestTimestamp) {
            babyObject = transaction.baby;
            latestTimestamp = timestamp;
        }
    }

    console.log("Fetch latest baby object succeeded.");

    return babyObject;
}

async function getLastSyncId() {
    console.log("Fetching latest sync ID from Baby Tracker service.");

    var devices = await getDevices();

    var device = null
    for (var i = 0; i < devices.length; i++) {
        if (devices[i].DeviceUUID == DeviceUUID) {
            device = devices[i];
        }
    }

    console.log("Fetch latest sync ID succeeded.");

    if (device) {
        return device.LastSyncID;
    }
    else {
        return 0;
    }
}

async function createDiaper(type, note) {
    console.log("Posting diaper record to Baby Tracker service.");

    var babyObject = await getLatestBabyObject();
    var timestamp = moment().format("YYYY-MM-DD HH:mm:ss ZZ");

    var data = {
        BCObjectType: "Diaper",
        amount: "2",
        status: type,
        baby: babyObject,
        note: note,
        pictureLoaded: true,
        pictureNote: [],
        time: timestamp,
        newFlage: true,
        objectID: uuidv4(),
        timestamp: timestamp
    };

    var payload = Buffer.from(JSON.stringify(data)).toString("base64");

    var syncId = await getLastSyncId();

    return new Promise((resolve, reject) => {
        request({
            method: "POST",
            url: "https://prodapp.babytrackers.com/account/transaction",
            json: {
                OPCode: 0,
                SyncID: syncId + 1,
                Transaction: payload
            },
            jar: true
        },
        function (err, response, body) {
            if (err) {
                console.log("ERROR: " + err);
                
                reject(err);
            }

            console.log("Post diaper record succeeded.");

            resolve();
        });
    });
}

exports.createWetDiaper = async function(note) {
    await createDiaper("0", note);
}

exports.createDirtyDiaper = async function(note) {
    await createDiaper("1", note);
}

exports.createSleep = async function(startTime, duration, note) {
    console.log("Posting sleep record to Baby Tracker service.");
    
    var babyObject = await getLatestBabyObject();
    var timestamp = moment().format("YYYY-MM-DD HH:mm:ss ZZ")

    var data = {
        BCObjectType: "Sleep",
        duration: duration,
        baby: babyObject,
        note: note,
        pictureLoaded: true,
        pictureNote: [],
        time: moment(startTime, "YYYY-MM-DD HH:mm:ss ZZ"),
        newFlage: true,
        objectID: uuidv4(),
        timestamp: timestamp
    };

    var payload = Buffer.from(JSON.stringify(data)).toString("base64");

    var syncId = await getLastSyncId();

    return new Promise((resolve, reject) => {
        request({
            method: "POST",
            url: "https://prodapp.babytrackers.com/account/transaction",
            json: {
                OPCode: 0,
                SyncID: syncId + 1,
                Transaction: payload
            },
            jar: true
        },
        function (err, response, body) {
            if (err) {
                console.log("ERROR: " + err);
                
                reject(err);
            }

            console.log("Post sleep record succeeded.");

            resolve();
        });
    });
}