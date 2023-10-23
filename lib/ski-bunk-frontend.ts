import * as cdk from 'aws-cdk-lib';

export class SkiBunkFrontend extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
    const bucket = new cdk.aws_s3.Bucket(this, "SkiBunket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    // new cdk.aws_s3_deployment.BucketDeployment(this, ", {
    //   sources: [cdk.aws_s3_deployment.Source.asset("./ski-bunks-frontend/build")],
    //   destinationBucket: bucket,
    // });

    // new cdk.CfnOutput(this, "BucketName", {
    //   value: bucket.bucketName,
    // });

  }
}


