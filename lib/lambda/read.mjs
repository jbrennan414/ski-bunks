import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async (event) => {

  console.log("event", event)

  try {

    // if we provide the ID, return that info, otherwise, get scan this month
    if (true) {

      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1; // Months start at 0!
      let date = today.getDate();
      
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

      console.log("We got items.....", items)

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
            return item !== matchedDate.bed_id
          })
        })
        
        availableBeds[`${year}${month}${doubleDate}`] = allBeds;
      }
  
      console.log("THAT WORKEd")

      return {
        statusCode: 200,
        body: JSON.stringify(availableBeds)
      }

    } else {

      const command = new GetCommand({
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: {
            'bed_id': '1',
            'date': '20231017'
          }
      });
    
      const dbresponse = await docClient.send(command);
    
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bed_id: dbresponse.Item.bed_id, 
          date: dbresponse.Item.date
        }),
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
    }
  }

};

