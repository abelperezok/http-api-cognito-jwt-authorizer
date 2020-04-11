#! /bin/bash

REGION=us-east-1
PROFILE=profile
S3_DEPLOYMENT_BUCKET=bucket-for-deployments
STACK_NAME=http-api-cognito-jwt-authorizer

sam package --s3-bucket $S3_DEPLOYMENT_BUCKET --s3-prefix $STACK_NAME \
	--output-template-file packaged.yaml \
	--profile $PROFILE

sam deploy --template-file packaged.yaml --stack-name $STACK_NAME \
	--s3-bucket $S3_DEPLOYMENT_BUCKET --s3-prefix $STACK_NAME \
    --region $REGION --capabilities CAPABILITY_IAM \
	--no-fail-on-empty-changeset \
	--profile $PROFILE