const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: 'ap-southeast-2' });

// specify Cognito app client id
const CLIENT_ID = process.env.CLIENT_ID;

// confirmSignUp function to handle user confirmation
const confirmSignUp = async (event) => {
    const payload = typeof event.body === 'string'
        ? JSON.parse(event.body || '{}')
        : (event.body || {});

    const { email, confirmationCode } = payload;

    if (!email || !confirmationCode) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'email and confirmationCode are required'
            })
        };
    }

    const params = {
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode
    };

    try {
        const command = new ConfirmSignUpCommand(params);
        await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User is confirmed successfully" })
        };
    } catch (error) {
        console.error("Error confirming user sign up:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error?.name || 'Internal server error',
                message: error?.message || 'Internal server error'
            })
        };
    }
}

module.exports = { confirmSignUp };