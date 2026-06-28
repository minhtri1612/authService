// import AWS Congnito SDK Classes
// CognitoIdentityproviderClient is the main class for interacting with AWS Cognito
// SignUpCommand is the command used to sign up a new user

const { CognitoIdentityProviderClient, SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");
const UserModel = require("../models/userModel");
const client = new CognitoIdentityProviderClient({ region: process.env.REGION });

// specify Cognito app client id
const CLIENT_ID = process.env.CLIENT_ID;

// signUp function to handle user sign up
const signUp = async (event) => {
  const { email, fullName, password } = JSON.parse(event.body);
  // prepare the parameters for the SignUpCommand
    const params = {
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            },
            {
                Name: "name",
                Value: fullName
            }
        ]
    };
    try {
        const command = new SignUpCommand(params);
        await client.send(command);
        const newUser = new UserModel(email, fullName);
        await newUser.save();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User signed up successfully" })
        };
    } catch (error) {
        console.error("Error signing up user:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error", details: error.message, name: error.name })
        };
    }
}

module.exports = { signUp };