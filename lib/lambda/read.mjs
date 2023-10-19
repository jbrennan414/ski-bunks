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

      let dateObj = new Date();
      let month = dateObj.getUTCMonth() + 1; //months from 1-12
      let year = dateObj.getUTCFullYear();

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

      const availableBeds = [
        "king_1",
        "king_2",
        "queen1_1",
        "queen1_2",
        "queen2_1",
        "queen2_2",
        "bunk_1",
        "bunk_2",
        "couch"
      ]
    
      const scanCommand = new ScanCommand(params);
      const result = await docClient.send(scanCommand);

      console.log("result", result)

      const items = result.Items.map((item) => unmarshall(item));
  
      return {
        statusCode: 200,
        body: JSON.stringify(items)
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

