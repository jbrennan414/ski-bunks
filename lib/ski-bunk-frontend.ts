import * as cdk from 'aws-cdk-lib';
const domainName = "ski-bunks.club";
export class SkiBunkFrontend extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const websiteBucket = new cdk.aws_s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: cdk.aws_s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'DeployWebsite', {
      sources: [cdk.aws_s3_deployment.Source.asset('./ski-bunks-frontend/build')],
      destinationBucket: websiteBucket,
    });
  }
}


