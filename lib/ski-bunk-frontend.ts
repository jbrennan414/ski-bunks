import * as cdk from 'aws-cdk-lib';
const domainName = "skibunks2.club";

export class SkiBunkFrontend extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const websiteBucket = new cdk.aws_s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName: domainName,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: cdk.aws_s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });
  }

}


