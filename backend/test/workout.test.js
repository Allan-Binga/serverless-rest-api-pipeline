const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const createWorkout = require("../api/createWorkout");
const getWorkout = require("../api/getWorkout");
const deleteWorkout = require("../api/deleteWorkout");
const updateWorkout = require("../api/updateWorkout");

// Mock AWS SDK and UUID
jest.mock("aws-sdk", () => {
  const mockDynamoDb = {
    put: jest.fn().mockReturnThis(),
    scan: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDynamoDb),
    },
  };
});

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("Workout API handlers", () => {
  let dynamoDb;

  beforeEach(() => {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests for createWorkout
  describe("createWorkout handler", () => {
    it("should create a workout session successfully", async () => {
      const mockSessionId = "test-session-id";
      uuidv4.mockReturnValue(mockSessionId);

      const mockEvent = {
        body: JSON.stringify({
          user_name: "testUser",
          workout_type: "Cardio",
        }),
      };

      dynamoDb.promise.mockResolvedValueOnce(); // Simulate successful DynamoDB put

      const result = await createWorkout.handler(mockEvent);

      expect(dynamoDb.put).toHaveBeenCalledWith({
        TableName: process.env.FITNESS_SESSIONS_TABLE,
        Item: {
          SessionId: mockSessionId,
          UserName: "testUser",
          WorkoutType: "Cardio",
          OrderStatus: "Scheduled",
        },
      });
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: "Workout session created successfully!",
          SessionId: mockSessionId,
        }),
      });
    });

    it("should handle DynamoDB errors gracefully", async () => {
      const mockEvent = {
        body: JSON.stringify({
          user_name: "testUser",
          workout_type: "Cardio",
        }),
      };

      dynamoDb.promise.mockRejectedValueOnce(new Error("DynamoDB error"));

      const result = await createWorkout.handler(mockEvent);

      expect(dynamoDb.put).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          error: "Could not create workout session: DynamoDB error",
        }),
      });
    });
  });

  // Tests for getWorkout
  describe("getWorkout handler", () => {
    it("should retrieve workout sessions successfully", async () => {
      const mockWorkouts = [
        { SessionId: "1", UserName: "testUser1", WorkoutType: "Cardio" },
        { SessionId: "2", UserName: "testUser2", WorkoutType: "Strength" },
      ];

      dynamoDb.promise.mockResolvedValueOnce({ Items: mockWorkouts });

      const result = await getWorkout.handler();

      expect(dynamoDb.scan).toHaveBeenCalledWith({
        TableName: process.env.FITNESS_SESSIONS_TABLE,
      });
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify(mockWorkouts),
      });
    });

    it("should handle DynamoDB errors gracefully", async () => {
      dynamoDb.promise.mockRejectedValueOnce(new Error("DynamoDB error"));

      const result = await getWorkout.handler();

      expect(dynamoDb.scan).toHaveBeenCalledWith({
        TableName: process.env.FITNESS_SESSIONS_TABLE,
      });
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          error: "Could not retrieve workout sessions: DynamoDB error",
        }),
      });
    });
  });

  describe("deleteWorkout handler", () => {
    it("should delete a workout session successfully", async () => {
      const mockEvent = {
        body: JSON.stringify({
          session_id: "test-session-id",
          user_name: "testUser",
        }),
      };

      dynamoDb.promise.mockResolvedValueOnce(); // Simulate successful DynamoDB delete

      const result = await deleteWorkout.handler(mockEvent);

      expect(dynamoDb.delete).toHaveBeenCalledWith({
        TableName: process.env.FITNESS_SESSIONS_TABLE,
        Key: {
          SessionId: "test-session-id",
          UserName: "testUser",
        },
      });
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: "Workout session deleted successfully!",
          SessionId: "test-session-id",
        }),
      });
    });

    it("should handle DynamoDB errors gracefully", async () => {
      const mockEvent = {
        body: JSON.stringify({
          session_id: "test-session-id",
          user_name: "testUser",
        }),
      };

      dynamoDb.promise.mockRejectedValueOnce(new Error("DynamoDB error"));

      const result = await deleteWorkout.handler(mockEvent);

      expect(dynamoDb.delete).toHaveBeenCalledWith({
        TableName: process.env.FITNESS_SESSIONS_TABLE,
        Key: {
          SessionId: "test-session-id",
          UserName: "testUser",
        },
      });
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          error: "Could not delete workout session: DynamoDB error",
        }),
      });
    });
  });

  describe("updateWorkout handler", () => {
    it("Should update a workout session successfully", async () => {
      const mockEvent = {
        body: JSON.stringify({
          session_id: "test-session-id",
          user_name: "testUser",
          new_status: "Completed",
        }),
      };

      dynamoDb.promise.mockResolvedValueOnce();

      const result = await updateWorkout.handler(mockEvent);

      expect(dynamoDb.update).toHaveBeenCalledWith({
        TableName: process.env.FITNESS_SESSIONS_TABLE,
        Key: {
          SessionId: "test-session-id",
          UserName: "testUser",
        },
        UpdateExpression: "SET SessionStatus = :status",
        ExpressionAttributeValues: {
          ":status": "Completed",
        },
      });

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: 'Workout session status updated successfully!',
          SessionId: 'test-session-id',
        }),
      });
    });

    it('Should handle DynamoDB update errors gracefully', async() => {
      const mockEvent = {
        body: JSON.stringify({
          session_id: 'test-session-id',
          user_name: 'testUser',
          new_status: 'Completed'
        })
      }

      dynamoDb.promise.mockRejectedValueOnce(new Error('DynamoDB error'))

      const result = await updateWorkout.handler(mockEvent)

      expect(dynamoDb.update).toHaveBeenCalledWith({
        TableName: process.env.FITNESS_SESSIONS_TABLE,
        Key: {
          SessionId: 'test-session-id',
          UserName: 'testUser',
        },
        UpdateExpression: 'SET SessionStatus = :status',
        ExpressionAttributeValues: {
          ':status': 'Completed',
        },
      });
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          error: 'Could not update workout session: DynamoDB error'
        })
      })
    })
  });
});
