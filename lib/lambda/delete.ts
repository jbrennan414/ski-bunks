import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { pathParameters } = event;
    const id = pathParameters!.id;

    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: process.env.DYNAMO_TABLE_NAME!,
      Key: { id },
      ReturnValues: 'ALL_OLD',
    };

    const result = await dynamoDB.delete(params).promise();

    if (!result.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error deleting item', error }),
    };
  }
};
