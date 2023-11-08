import { DynamoDBClient, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

  console.log("event", event);

  try {
    
    if (event.queryStringParameters?.user){
      
      const userEmail = event.queryStringParameters.user;
      
      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        FilterExpression: 'contains(#emailAttr, :email)',
        ExpressionAttributeNames: {
          '#emailAttr': 'user_email',
        },
        ExpressionAttributeValues: marshall({
          ':email': userEmail,
        }),
      };

      const scanCommand = new ScanCommand(params);
      const result = await docClient.send(scanCommand);
      const items = result.Items.map((item) => unmarshall(item));
        
      return {
        statusCode:200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(items)
      };
    }

    // if we provide the ID, return that info, otherwise, get scan this month
    if (!event.queryStringParameters?.date) {
      
      const today = new Date();
      let date = today.getDate();
      
      // let month = event.queryStringParameters.month;
      // let year = event.queryStringParameters.year;
      let month = 11;
      let year= 2023;
      if (date < 10) date = '0' + date;
      if (month < 10) month = '0' + month;

      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        FilterExpression: 'contains(#dateAttr, :year)',
        ExpressionAttributeNames: {
          '#dateAttr': 'reservation_date',
        },
        ExpressionAttributeValues: marshall({
          ':year': `${year}${month}`,
        }),
      };

      const daysInMonth = new Date(year, month, 0).getDate();
      
      let openBeds = 9;
      const availableBeds = {};
      
      const scanCommand = new ScanCommand(params);
      const result = await docClient.send(scanCommand);
      const items = result.Items.map((item) => unmarshall(item));

      for (let index = 1; index < (daysInMonth + 1); index++) {
        let doubleDate = index;
        if (doubleDate < 10) doubleDate = '0' + doubleDate;
        
        const matchingDates = items.filter((item) => item.reservation_date === `${year}${month}${doubleDate}`);
        
        availableBeds[`${year}${month}${doubleDate}`] = (openBeds - matchingDates.length);
      }
  
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(availableBeds)
      };

    } else {
      
      const selectedDate = event.queryStringParameters?.date;
      
      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME, 
        KeyConditionExpression: "reservation_date = :r_date",
        ExpressionAttributeValues: {
          ":r_date": { S: selectedDate}, 
        }
      };

      const command = new QueryCommand(params);
      const result = await docClient.send(command);
      const items = result.Items.map((item) => unmarshall(item));
      
      return {
        statusCode:200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ reservations: items })
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: e.message
      }),
    };
  }

};

