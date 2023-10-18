import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { body } = event;
    const input = JSON.parse(body!);

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.DYNAMO_TABLE_NAME!,
      Item: {
        bed_id: "queen_1",
        date: "20231004",
        attributes: {
          user_id:"telbe_telberson"
        },
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating item', error }),
    };
  }
};
