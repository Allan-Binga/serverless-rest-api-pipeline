const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { session_id, user_name } = requestBody;

  const params = {
    TableName: process.env.FITNESS_SESSIONS_TABLE,
    Key: {
      SessionId: session_id,
      UserName: user_name
    }
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Workout session deleted successfully!', SessionId: session_id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not delete workout session: ${error.message}` })
    };
  }
};
