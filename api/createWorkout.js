const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const userName = requestBody.user_name;
  const workoutType = requestBody.workout_type;
  const Id = uuidv4();

  const params = {
    TableName: process.env.FITNESS_SESSIONS_TABLE,
    Item: {
      SessionId: sessionId,
      UserName: userName,
      WorkoutType: workoutType,
      OrderStatus: 'Scheduled'
    }
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Workout session created successfully!', OrderId: orderId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not create workout session: ${error.message}` })
    };
  }
};