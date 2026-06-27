const { CognitoIdentityProviderClient, GlobalSignOutCommand } = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: 'ap-southeast-2' });

exports.signOut = async (event) => {
    const { accessToken } = JSON.parse(event.body);
     
    const params = {
        AccessToken: accessToken
     };

    try {
        const command = new GlobalSignOutCommand(params);
        await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully signed out' })
        };
    } catch (error) {
        console.error('Error signing out:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to sign out' })
        };
    }
} 