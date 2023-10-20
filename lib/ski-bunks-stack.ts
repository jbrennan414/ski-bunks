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

    dynamoTable.grantFullAccess(readLambda);

    // Create an API Gateway
    const api = new aws_apigateway.RestApi(this, 'SkiBunksAPI');

    // Define a resource and a GET method to access the Lambda function
    api.root.addMethod('GET', new aws_apigateway.LambdaIntegration(readLambda));
  }
}


//   constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // Create a DynamoDB table
//     const dynamoTable = new aws_dynamodb.Table(this, 'SkiBunkDbTable', {
//       partitionKey: { name: 'bed_id', type: aws_dynamodb.AttributeType.STRING },
//       sortKey: { name: 'date', type: aws_dynamodb.AttributeType.STRING},
//       removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE, // Not recommended for production
//     });

//     dynamoTable.addGlobalSecondaryIndex({
//       indexName: 'date-index',
//       partitionKey: { name: 'date', type: aws_dynamodb.AttributeType.STRING },
//     });
  
//     const createLambda = new aws_lambda.Function(this, 'CreateLambda', {
//       runtime: aws_lambda.Runtime.NODEJS_18_X,
//       handler: 'create.handler',
//       code: aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
//       environment: {
//         DYNAMO_TABLE_NAME: dynamoTable.tableName,
//       },
//     });

//     const readLambda = new aws_lambda.Function(this, "ReadLambda", {
//       runtime: aws_lambda.Runtime.NODEJS_18_X,
//       code: aws_lambda.Code.fromAsset("lib/lambda"),
//       handler: "read.main",
//       environment: {
//         DYNAMO_TABLE_NAME: dynamoTable.tableName,
//       },
//     });

//     const updateLambda = new aws_lambda.Function(this, 'UpdateLambda', {
//       runtime: aws_lambda.Runtime.NODEJS_18_X,
//       handler: 'update.handler',
//       code: aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
//       environment: {
//         DYNAMO_TABLE_NAME: dynamoTable.tableName,
//       },
//     });

//     const deleteLambda = new aws_lambda.Function(this, 'DeleteLambda', {
//       runtime: aws_lambda.Runtime.NODEJS_18_X,
//       handler: 'delete.handler',
//       code: aws_lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
//       environment: {
//         DYNAMO_TABLE_NAME: dynamoTable.tableName,
//       },
//     });

//     dynamoTable.grantFullAccess(readLambda)

//     // Create an API Gateway and define CRUD methods
//     const api = new aws_apigateway.RestApi(this, 'SkiBunksAPI');

//     const items = api.root.addResource('items');
//     items.addMethod('POST', new aws_apigateway.LambdaIntegration(createLambda));
//     items.addMethod('GET', new aws_apigateway.LambdaIntegration(readLambda), {
//       authorizationType: aws_apigateway.AuthorizationType.NONE,
//       methodResponses: [{ statusCode: '200' }, { statusCode: '400' }, { statusCode: '500' }],
      
//     });

//     const singleItem = items.addResource('{id}');
//     singleItem.addMethod('GET', new aws_apigateway.LambdaIntegration(readLambda));
//     singleItem.addMethod('PUT', new aws_apigateway.LambdaIntegration(updateLambda));
//     singleItem.addMethod('DELETE', new aws_apigateway.LambdaIntegration(deleteLambda));


//     // Deploy the API Gateway
//     const deployment = new aws_apigateway.Deployment(this, 'MyApiDeployment', {
//       api,
//     });
    
//     new aws_apigateway.Stage(this, 'MyApiStage', {
//       deployment: deployment,
//       stageName: 'prod1',
//     });



//   }
// }

