import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

  try { 

    const body = JSON.parse(event.body);
    
    const tableName = process.env.DYNAMO_TABLE_NAME;
    const indexName = "date-user_email-index";
    
    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: "#partitionKey = :partitionValue and #sortKey = :sortValue",
      ExpressionAttributeNames: {
        "#partitionKey": "reservation_date",
        "#sortKey": "user_email" 
      },
      ExpressionAttributeValues: {
        ":partitionValue": { S: body.reservation_date }, 
        ":sortValue": { S: body.email }
      }
    };

    const command = new QueryCommand(params);
    const response = await client.send(command);
    const items = response.Items.length;
    
    if (items !== 0) {

      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "You already have a reservation on this day" })
      };
    }
    
    const input = {
      TableName: process.env.DYNAMO_TABLE_NAME,
      Item: { 
        "bed_id": { 
          S: body.bed_id
        },
        "reservation_date": {
          S: body.reservation_date
        },
        "user_email": {
            S: body.email
        },
        "user_name": {
          S: body.name
        },
        "user_picture": {
          S: body.picture 
        },
        "reservation_id": {
          S: Math.floor(Math.random() * 10000000000000000000).toString()
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