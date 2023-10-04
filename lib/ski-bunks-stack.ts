import * as cdk from 'aws-cdk-lib';
import { aws_dynamodb, aws_apigateway, aws_lambda } from 'aws-cdk-lib';
import * as path from 'path';

export class SkiBunksStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table
    const dynamoTable = new aws_dynamodb.Table(this, 'MyDynamoDBTable', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Not recommended for production
    });
  
    const createLambda = new aws_lambda.Function(this, 'CreateLambda', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: 'create.handler',
      code: aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      environment: {
        DYNAMO_TABLE_NAME: dynamoTable.tableName,
      },
    });

    const readLambda = new aws_lambda.Function(this, 'ReadLambda', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: 'read.handler',
      code: aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      environment: {
        DYNAMO_TABLE_NAME: dynamoTable.tableName,
      },
    });

    const updateLambda = new aws_lambda.Function(this, 'UpdateLambda', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: 'update.handler',
      code: aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      environment: {
        DYNAMO_TABLE_NAME: dynamoTable.tableName,
      },
    });

    const deleteLambda = new aws_lambda.Function(this, 'DeleteLambda', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: 'delete.handler',
      code: aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      environment: {
        DYNAMO_TABLE_NAME: dynamoTable.tableName,
      },
    });

    // Create an API Gateway and define CRUD methods
    const api = new aws_apigateway.RestApi(this, 'MyApi');

    const items = api.root.addResource('items');
    items.addMethod('POST', new aws_apigateway.LambdaIntegration(createLambda));
    items.addMethod('GET', new aws_apigateway.LambdaIntegration(readLambda));

    const singleItem = items.addResource('{id}');
    singleItem.addMethod('GET', new aws_apigateway.LambdaIntegration(readLambda));
    singleItem.addMethod('PUT', new aws_apigateway.LambdaIntegration(updateLambda));
    singleItem.addMethod('DELETE', new aws_apigateway.LambdaIntegration(deleteLambda));
  }
}

// PK SK 
// ${telbe#doublebed1}  ${20231003}
// ${traut#doublebed1} ${20231003}
// 