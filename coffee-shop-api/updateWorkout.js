const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { session_id, new_status, user_name } = requestBody;

  const params = {
    TableName: process.env.FITNESS_SESSIONS_TABLE,
    Key: {
      SessionId: session_id,
      UserName: user_name
    },
    UpdateExpression: 'SET SessionStatus = :status',
    ExpressionAttributeValues: {
      ':status': new_status
    }
  };

  try {
    await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Workout session status updated successfully!', SessionId: session_id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not update workout session: ${error.message}` })
    };
  }
};
