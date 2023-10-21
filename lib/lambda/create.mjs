import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

  try { 

    const body = JSON.parse(event.body);

    const input = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Item: { 
        "bed_id": { 
          S: body.bed_id
        },
        "date": {
          S: "20231003"
        },
        "user_email": {
            S: "lolfake"
        },
        "user_name": {
          S: "lolfake"
        },
        "user_picture": {
          S: "lolfake"
        }
      }
    }

    const putCommand = new PutItemCommand(input);
    const result = await docClient.send(putCommand);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ message: result }),
    }

  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ message: `Error ${e.message}` }),

    }
  }


}