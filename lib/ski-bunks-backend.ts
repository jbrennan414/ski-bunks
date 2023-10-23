import * as cdk from 'aws-cdk-lib';
import { aws_dynamodb, aws_apigateway, aws_lambda } from 'aws-cdk-lib';

export class SkiBunkBackend extends cdk.Stack {

 constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table
    const dynamoTable = new aws_dynamodb.Table(this, 'SkiBunkDbTable', {
      partitionKey: { name: 'bed_id', type: aws_dynamodb.AttributeType.STRING },
      sortKey: { name: 'date', type: aws_dynamodb.AttributeType.STRING},
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Not recommended for production
    });

    dynamoTable.addGlobalSecondaryIndex({
      indexName: 'date-index',
      partitionKey: { name: 'date', type: aws_dynamodb.AttributeType.STRING },
    });

    const readLambda = new aws_lambda.Function(this, "ReadLambda", {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      code: aws_lambda.Code.fromAsset("lib/lambda"),
      handler: "read.main",
        environment: {
          DYNAMO_TABLE_NAME: dynamoTable.tableName,
        },
    });

    const createLambda = new aws_lambda.Function(this, "CreateLambda", {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      code: aws_lambda.Code.fromAsset("lib/lambda"),
      handler: "create.main",
        environment: {
          DYNAMO_TABLE_NAME: dynamoTable.tableName,
        },
    });

    const deleteLambda = new aws_lambda.Function(this, "DeleteLambda", {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      code: aws_lambda.Code.fromAsset("lib/lambda"),
      handler: "delete.main",
        environment: {
          DYNAMO_TABLE_NAME: dynamoTable.tableName,
        },
    });

    dynamoTable.grantFullAccess(readLambda);
    dynamoTable.grantFullAccess(createLambda);
    dynamoTable.grantFullAccess(deleteLambda);

    const api = new aws_apigateway.RestApi(this, 'SkiBunksAPI', {
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });

    // Define a resource and a GET method to access the Lambda function
    api.root.addMethod('GET', new aws_apigateway.LambdaIntegration(readLambda));
    api.root.addMethod('POST', new aws_apigateway.LambdaIntegration(createLambda));
    api.root.addMethod('DELETE', new aws_apigateway.LambdaIntegration(deleteLambda));
  }
}



