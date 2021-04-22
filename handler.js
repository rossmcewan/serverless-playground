const AWS = require('aws-sdk');
const sts = new AWS.STS();

module.exports.withAssumed = async (event) => {
  const role = await sts.assumeRole({
    RoleSessionName: 'TheSession',
    RoleArn: process.env.TARGET_ROLE
  }).promise();
  console.log('credentials', role.Credentials);
  const documentClient = new AWS.DynamoDB.DocumentClient({  
    credentials: {
      accessKeyId: role.Credentials.AccessKeyId,
      secretAccessKey: role.Credentials.SecretAccessKey,
      sessionToken: role.Credentials.SessionToken
    }
  });
  const results = await documentClient.scan({
    TableName: 'TheTable'
  }).promise();
  console.log('items', results.Items);
};

module.exports.withoutAssumed = async (event) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const results = await documentClient.scan({
    TableName: 'TheTable'
  }).promise();
  console.log('items', results.Items);
};

