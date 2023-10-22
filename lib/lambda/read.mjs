import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

  console.log("event", event);

  try {
    
    if (event.queryStringParameters.user){
      
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
    if (!event.queryStringParameters.day) {
      
      const today = new Date();
      let date = today.getDate();
      let month = event.queryStringParameters.month;
      let year = event.queryStringParameters.year;
      if (date < 10) date = '0' + date;
      if (month < 10) month = '0' + month;

      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        FilterExpression: 'contains(#dateAttr, :year)',
        ExpressionAttributeNames: {
          '#dateAttr': 'date',
        },
        ExpressionAttributeValues: marshall({
          ':year': `${year}${month}`,
        }),
      };

      const daysInMonth = new Date(year, month, 0).getDate();
      
      const availableBeds = {};

      const scanCommand = new ScanCommand(params);
      const result = await docClient.send(scanCommand);
      const items = result.Items.map((item) => unmarshall(item));

      for (let index = 1; index < (daysInMonth + 1); index++) {
        let doubleDate = index;
        if (doubleDate < 10) doubleDate = '0' + doubleDate;
        
        let allBeds = [
          "king1_1",
          "king1_2",
          "queen1_1",
          "queen1_2",
          "queen2_1",
          "queen2_2",
          "bunk_1",
          "bunk_2",
          "couch"
        ];
        
        const matchingDates = items.filter((item) => item.date === `${year}${month}${doubleDate}`);
        
        // look at matching dates and remove bed
        matchingDates.forEach((matchedDate ) => {
          allBeds = allBeds.filter(function(item) {
            return item !== matchedDate.bed_id;
          });
        });
        
        availableBeds[`${year}${month}${doubleDate}`] = allBeds;
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

      // The user requested a specific day
      let month = event.queryStringParameters.month;
      let year = event.queryStringParameters.year;
      let day = event.queryStringParameters.day;
      if (month < 10) month = '0' + month;

      let allBeds = [
        "king1_1",
        "king1_2",
        "queen1_1",
        "queen1_2",
        "queen2_1",
        "queen2_2",
        "bunk_1",
        "bunk_2",
        "couch"
      ];

      const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        FilterExpression: 'contains(#dateAttr, :year)',
        ExpressionAttributeNames: {
          '#dateAttr': 'date',
        },
        ExpressionAttributeValues: marshall({
          ':year': `${year}${month}${day}`,
        }),
      };

      const scanCommand = new ScanCommand(params);
      const result = await docClient.send(scanCommand);
      const items = result.Items.map((item) => unmarshall(item));
      
      items.forEach((item) => {
        var index = allBeds.indexOf(item.bed_id);
        if (index !== -1) {
          allBeds.splice(index, 1);
        }
      });
      
      return {
        statusCode:200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ 
          occupiedBeds:items,
          openBeds: allBeds
        })
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

