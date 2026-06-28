const {DynamoDBClient, PutItemCommand} = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const client = new DynamoDBClient({region: process.env.REGION});
const TABLE_NAME = "Users";

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });

class UserModel {
    constructor(email, fullName) {
        this.userId = crypto.randomUUID(); // Generate a unique user ID
        this.email = email;
        this.fullName = fullName;
        this.state = "";
        this.city = "";
        this.locality = "";
        this.createdAt = new Date().toISOString();
    }

    // save user to dynamodb
    async save() {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                userId: { S: this.userId },
                email: { S: this.email },
                fullName: { S: this.fullName },
                state: { S: this.state },
                city: { S: this.city },
                locality: { S: this.locality },
                createdAt: { S: this.createdAt }
            }
        };
        try {
            await dynamoClient.send(new PutItemCommand(params));
        }   
        catch (error) {
            console.error("Error saving user to DynamoDB:", error);
            throw new Error("Error saving user to DynamoDB");
        }
    }
}
module.exports = UserModel;