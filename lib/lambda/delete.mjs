import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

  console.log("event", event);

  try {

    const reservation_date = event.queryStringParameters.date;
    const user_email = event.queryStringParameters.user_email;
    
    const input = { 
      TableName:  process.env.DYNAMO_TABLE_NAME,
      Key: {
        "reservation_date": { 
          S: reservation_date
        },
        "user_email": {
          S: user_email
        }
      }
    };
    
    
    const command = new DeleteItemCommand(input);
    const response = await client.send(command);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ response })
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

};

