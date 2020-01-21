# babytracker-iot-button

This is an [AWS Lambda](https://aws.amazon.com/lambda/) function written in Node.js that logs a diaper change to the [Baby Tracker](https://apps.apple.com/app/appname/id779656557) app when an [AWS IoT Button](https://aws.amazon.com/iotbutton/) is pressed.


## Deployment

Configure your AWS IoT Button by following the instructions here: https://aws.amazon.com/iotbutton/faq/

This will involve registering the AWS IoT Button on the AWS Management Console, generating a certificate and private key for your AWS endpoint, configuring the button for your Wi-Fi network, and uploading the certificate and private key to your button.

Upload the code for the AWS Lambda Function by following the instructions here: https://docs.aws.amazon.com/lambda/latest/dg/programming-model.html

Connect your AWS IoT Button as a trigger for the AWS Lambda Function.

Create three environment variables on your AWS Lambda Function:

`EMAIL_ADDRESS` - The email address for your Baby Tracker account.

`PASSWORD` - The password for your Baby Tracker account.

`DEVICE_UUID` - Generate a random UUID and paste it here. You can use a site like https://guidgenerator.com/online-guid-generator.aspx to generate this.


## Usage

Press the button one time to log a wet diaper. Press the button two times to log a dirty diaper. Long press the button to log a mixed diaper.


## Known Issues

If the button is not logging to the Baby Tracker app for some reason, generate a new UUID for the `DEVICE_UUID`. Disconnect your mobile device(s) from the group in the Baby Tracker app. Then reconnect one device to the group, selecting the Reset Group option when reconnecting. This should clear out any sync issues and recreate the group.


## License

This software, and its dependencies, are distributed free of charge and licensed under the GNU General Public License v3. For more information about this license and the terms of use of this software, please review the `LICENSE.txt` file.
