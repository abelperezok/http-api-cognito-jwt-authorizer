#! /bin/bash

REGION=us-east-1
PROFILE=dynamocode
S3_DEPLOYMENT_BUCKET=dynamocode-deployments
STACK_NAME=sam-test-http-api-auth

sam package --s3-bucket $S3_DEPLOYMENT_BUCKET --s3-prefix $STACK_NAME \
	--output-template-file packaged.yaml \
	--profile $PROFILE

sam deploy --template-file packaged.yaml --stack-name $STACK_NAME \
	--s3-bucket $S3_DEPLOYMENT_BUCKET --s3-prefix $STACK_NAME \
    --region $REGION --capabilities CAPABILITY_IAM \
	--no-fail-on-empty-changeset \
	--profile $PROFILE