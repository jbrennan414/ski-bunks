import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

  try { 

    const body = JSON.parse(event.body);
    
    const selectedDate = body.reservation_date;
    
    const params = {
      TableName: process.env.DYNAMO_TABLE_NAME, 
      KeyConditionExpression: "reservation_date = :r_date",
      ExpressionAttributeValues: {
        ":r_date": { S: selectedDate}, 
      }
    };
    
    const command = new QueryCommand(params);
    const response = await client.send(command);
    const items = response.Items;
    
    if (items.length >= 9) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "Sorry! No room for ya!" })
      };
    }
    
    const matchedItems = items.filter(item => item.user_email === body.email);

    if (matchedItems.length !== 0) {

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
    };

    const putCommand = new PutItemCommand(input);
    const result = await docClient.send(putCommand);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ message: result }),
    };

  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ message: `Error ${e.message}` }),

    };
  }


};