import * as cdk from 'aws-cdk-lib';
const domainName = "www.skibunks.club";

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

    new cdk.aws_s3_deployment.BucketDeployment(this, 'DeployWebsite', {
      sources: [cdk.aws_s3_deployment.Source.asset('./ski-bunks-frontend/build')],
      destinationBucket: websiteBucket,
      metadata: {
        'deploymentTimestamp': Date.now().toString()
      },
      distribution: new cdk.aws_cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket
            },
            behaviors: [{ 
              isDefaultBehavior: true,
              viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            }]
          }
        ]
      })
    });
  }
}


