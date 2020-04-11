# http-api-cognito-jwt-authorizer

Example of using Cognito as JWT authorizer for HttpApi. 

This repository contains a simple HttpApi and Lambda function and shows how to secure it using Cognito as JWT authorizer.

## Getting Started

### Deploying the backend

Edit the build.sh script and double check execution permission on the file. 

```
REGION= AWS region to deploy the stack
PROFILE= AWS CLI credentials profile. See aws configure.
S3_DEPLOYMENT_BUCKET= bucket for deployments
STACK_NAME= Any name for the stack
```

Make sure the S3 bucket specified in S3_DEPLOYMENT_BUCKET exists in the region set in REGION.

Once all this is done, you're good to go to deploy the stack.

Do that by running the script or manually issuing the sam commands in the file.

```shell
$ ./build.sh
```

### Preparing the frontend

The frontend it's a typical Nodejs console application that interacts with the terminal to get the username and password from the user and communicates with the backend to authenticate and retrieve secure information.

```shell
$ cd client
$ npm install
```

Create .env file from the sample

```shell
$ mv sample.env .env
```

Update .env file with the information from the outputs after deploying the backend.

## Create a Cognito user

YOu can use the AWS Console to create Cognito users, but if you prefer the command line, here is how. 

Sign up providing the client id, username and password.

```shell
$ aws cognito-idp sign-up \
  --client-id asdfsdfgsdfgsdfgfghsdf \
  --username abel@example.com \
  --password Test.1234 \
  --user-attributes Name="email",Value="abel@example.com" Name="name",Value="Abel Perez" \
  --profile default \
  --region us-east-1
 
{
    "UserConfirmed": false, 
    "UserSub": "aaa30358-3c09-44ad-a2ec-5f7fca7yyy16", 
    "CodeDeliveryDetails": {
        "AttributeName": "email", 
        "Destination": "a***@e***.com", 
        "DeliveryMedium": "EMAIL"
    }
}
```

Confirm the user (Emails doesn't have to exist)

```shell
$ aws cognito-idp admin-confirm-sign-up \
  --user-pool-id us-east-qewretry \
  --username abel@example.com \
  --profile default \
  --region us-east-1
```

Verify everything is OK.

```shell
$ aws cognito-idp admin-get-user \
  --user-pool-id us-east-qewretry \
  --username abel@example.com \
  --profile default \
  --region us-east-1 \
  --query UserStatus
 
"CONFIRMED"
```

## Running the client

Inside client directory, just run as a typical Nodejs app.

```shell
$ node index.js 
Username: abel@example.com
Password: *********
Request successful.
{ test: 'Hello HttpApi',
  claims:
   { auth_time: '1586631192',
     client_id: 'asdfsdfgsdfgsdfgfghsdf',
     'cognito:groups': '[Group2 Group1]',
     event_id: 'c82c7b7b-887d-47db-b262-ee29cd11b68b',
     exp: '1586634792',
     iat: '1586631192',
     iss:
      'https://cognito-idp.us-east-1.amazonaws.com/us-east-qewretry',
     jti: 'd7199012-7274-4a72-aa8c-d6b034d385a0',
     sub: 'cce30358-3c09-44ad-a2ec-5f7fca7dbd16',
     token_use: 'access',
     username: 'cce30358-3c09-44ad-a2ec-5f7fca7dbd16' } }
```