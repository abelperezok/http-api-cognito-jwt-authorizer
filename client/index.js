#! /usr/bin/env node

const dotenv = require('dotenv');
dotenv.config();

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');
const reader = require("readline-sync");
const https = require('https');

const poolData = {
    UserPoolId: process.env.USER_POOL,
    ClientId: process.env.POOL_CLIENT
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const username = reader.question("Username: ");
const password = reader.question("Password: ", { hideEchoBack: true });

var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password,
});

var userData = {
    Username : username,
    Pool : userPool
};

var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        // console.log('access token + ' + result.getAccessToken().getJwtToken());
        // console.log('id token + ' + result.getIdToken().getJwtToken());
        // console.log('refresh token + ' + result.getRefreshToken().getToken());

        const accessToken = result.getAccessToken().getJwtToken();

        const options = {
            hostname: process.env.API_ENDPOINT,
            port: 443,
            path: '/secure',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };

        const req = https.request(options, res => {

            if (res.statusCode == 200) {
                console.log('Request successful.');
            } else {
                console.log('Something went wrong.');
            }

            res.on('data', d => {
                const result = JSON.parse(d.toString());
                console.log(result);
            });

        });

        req.on('error', error => {
            console.error(error);
        });
        req.end();
    },
    onFailure: function (err) {
        console.log(err);
    },

});
