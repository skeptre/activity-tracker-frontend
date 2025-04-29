# Activity Tracker Backend API Specification

## Overview

This document outlines the complete API specification for the Activity Tracker Backend. The API provides endpoints for user management, profile management, and activity tracking including workouts, weight records, and daily goals.

## Base URL

All endpoints are relative to the base URL of your deployed application.

## Authentication

Most endpoints require authentication using a session token. This token is obtained during login and should be included in subsequent requests.

## API Endpoints

### User Management

#### Create User Account
- **Endpoint**: `POST /api/users`
- **Description**: Create a new user account
- **Auth Required**: No
- **Request Body**: 
  ```json
  {
    "first_name": "String",
    "last_name": "String",
    "email": "String",
    "password": "String"
  }
  ```
- **Success Response**: 
  - **Code**: 201 CREATED
  - **Content**: 
    ```json
    {
      "user_id": 14
    }
    ```
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid request body
  - **Code**: 500 INTERNAL SERVER ERROR

#### Delete User Account
- **Endpoint**: `DELETE /api/users`
- **Description**: Delete a user account
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
- **Error Responses**:
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 404 NOT FOUND - User not found
  - **Code**: 500 INTERNAL SERVER ERROR

#### User Login
- **Endpoint**: `POST /api/users/login`
- **Description**: Authenticate a user
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "String",
    "password": "String"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "user_id": 1,
      "session_token": "b5d9e7be6c97aa855f721b6e742120f2"
    }
    ```
- **Error Response**:
  - **Code**: 400 BAD REQUEST - Invalid credentials

#### User Logout
- **Endpoint**: `POST /api/users/logout`
- **Description**: Log out a user
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Missing or invalid token
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

### Profile Management

#### Get User Profile
- **Endpoint**: `GET /api/profile`
- **Description**: Get the profile information for the authenticated user
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Profile data object
- **Error Responses**:
  - **Code**: 404 NOT FOUND - User not found
  - **Code**: 500 INTERNAL SERVER ERROR

#### Update User Profile
- **Endpoint**: `POST /api/profile`
- **Description**: Update the profile information for the authenticated user
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "first_name": "String",
    "last_name": "String",
    "email": "String",
    "password": "String" // optional
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Profile updated successfully"
    }
    ```
- **Error Response**:
  - **Code**: 500 INTERNAL SERVER ERROR - Update failed

#### Get User Metrics
- **Endpoint**: `GET /api/profile/metrics`
- **Description**: Get the body metrics for the authenticated user
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Metrics data object
- **Error Responses**:
  - **Code**: 404 NOT FOUND - Metrics not found
  - **Code**: 500 INTERNAL SERVER ERROR

#### Update User Metrics
- **Endpoint**: `PATCH /api/profile/metrics`
- **Description**: Update the body metrics for the authenticated user
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "age": Number,
    "height": Number
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Metrics updated successfully"
    }
    ```
- **Error Response**:
  - **Code**: 500 INTERNAL SERVER ERROR - Update failed

### Activity Management - Workouts

#### Add New Workout
- **Endpoint**: `POST /api/activity/workouts`
- **Description**: Record a new workout
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "workout_date": Number, // Unix timestamp
    "type": "String",
    "duration": Number, // minutes
    "calories_burned": Number,
    "intensity": Number // 0-3
  }
  ```
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
      "message": "success",
      "workout_id": 42
    }
    ```
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid request body
  - **Code**: 500 INTERNAL SERVER ERROR

#### Get All Workouts
- **Endpoint**: `GET /api/activity/workouts`
- **Description**: Get all workouts for the authenticated user
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of workout objects
    ```json
    [
      {
        "workout_id": 42,
        "workout_date": 1709164800,
        "type": "Running",
        "duration": 45,
        "calories_burned": 300,
        "intensity": 2
      }
    ]
    ```
- **Error Responses**:
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Get Specific Workout
- **Endpoint**: `GET /api/activity/workouts/{workoutID}`
- **Description**: Get details of a specific workout
- **Auth Required**: Yes
- **Path Parameters**:
  - `workoutID`: ID of the workout to retrieve
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Workout details
    ```json
    {
      "workout_id": 42,
      "workout_date": 1709164800,
      "type": "Running",
      "duration": 45,
      "calories_burned": 300,
      "intensity": 2
    }
    ```
- **Error Responses**:
  - **Code**: 404 NOT FOUND - Invalid workout ID
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Update Workout
- **Endpoint**: `PUT /api/activity/workouts/{workoutID}`
- **Description**: Update a specific workout
- **Auth Required**: Yes
- **Path Parameters**:
  - `workoutID`: ID of the workout to update
- **Request Body**:
  ```json
  {
    "workout_date": Number, // Unix timestamp
    "type": "String",
    "duration": Number, // minutes
    "calories_burned": Number,
    "intensity": Number // 0-3
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid request body
  - **Code**: 404 NOT FOUND - Invalid workout ID
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Delete Workout
- **Endpoint**: `DELETE /api/activity/workouts/{workoutID}`
- **Description**: Delete a specific workout
- **Auth Required**: Yes
- **Path Parameters**:
  - `workoutID`: ID of the workout to delete
- **Success Response**:
  - **Code**: 200 OK
- **Error Responses**:
  - **Code**: 404 NOT FOUND - Invalid workout ID
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

### Activity Management - Weight

#### Add New Weight Record
- **Endpoint**: `POST /api/activity/weight`
- **Description**: Add a new weight record
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "weight": Number,
    "recorded_at": Number // Unix timestamp
  }
  ```
- **Success Response**:
  - **Code**: 201 CREATED
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid request body
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Get Weight History
- **Endpoint**: `GET /api/activity/weight`
- **Description**: Get weight history for the authenticated user
- **Auth Required**: Yes
- **Query Parameters**:
  - `limit`: Number (default: 10, max: 100)
  - `offset`: Number (default: 0)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of weight records
    ```json
    [
      {
        "weight_id": 1,
        "weight": 75.5,
        "recorded_at": 1709164800
      }
    ]
    ```
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid parameters
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Get Specific Weight Record
- **Endpoint**: `GET /api/activity/weight/{weightID}`
- **Description**: Get a specific weight record
- **Auth Required**: Yes
- **Path Parameters**:
  - `weightID`: ID of the weight record to retrieve
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Weight record details
    ```json
    {
      "weight": 75.5,
      "recorded_at": 1709164800
    }
    ```
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid weight ID
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Update Weight Record
- **Endpoint**: `PUT /api/activity/weight/{weightID}`
- **Description**: Update a specific weight record
- **Auth Required**: Yes
- **Path Parameters**:
  - `weightID`: ID of the weight record to update
- **Request Body**:
  ```json
  {
    "weight": Number,
    "recorded_at": Number // Unix timestamp
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid request body
  - **Code**: 404 NOT FOUND - Weight record not found
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Delete Weight Record
- **Endpoint**: `DELETE /api/activity/weight/{weightID}`
- **Description**: Delete a specific weight record
- **Auth Required**: Yes
- **Path Parameters**:
  - `weightID`: ID of the weight record to delete
- **Success Response**:
  - **Code**: 200 OK
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid weight ID
  - **Code**: 404 NOT FOUND - Weight record not found
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

### Activity Management - Goals

#### Get Daily Goals
- **Endpoint**: `GET /api/activity/goals`
- **Description**: Get all daily activity goals for the authenticated user
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of goal objects
    ```json
    [
      {
        "goal_id": 1,
        "goal_type": "step",
        "target_value": 5000,
        "recorded_at": 1709164800
      }
    ]
    ```
- **Error Responses**:
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Update Daily Goal
- **Endpoint**: `PUT /api/activity/goals/{goalID}`
- **Description**: Update a specific daily goal
- **Auth Required**: Yes
- **Path Parameters**:
  - `goalID`: ID of the goal to update
- **Request Body**:
  ```json
  {
    "target_value": Number,
    "recorded_at": Number // Unix timestamp
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid request body
  - **Code**: 404 NOT FOUND - Invalid goal ID
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Add Daily Progress
- **Endpoint**: `POST /api/activity/goals/{goalID}/progress`
- **Description**: Add progress towards a daily goal
- **Auth Required**: Yes
- **Path Parameters**:
  - `goalID`: ID of the goal to add progress for
- **Request Body**:
  ```json
  {
    "progress_value": Number,
    "recorded_at": Number // Unix timestamp
  }
  ```
- **Success Response**:
  - **Code**: 201 CREATED
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid request body
  - **Code**: 404 NOT FOUND - Invalid goal ID
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 500 INTERNAL SERVER ERROR

#### Get Daily Progress
- **Endpoint**: `GET /api/activity/goals/{goalID}/progress`
- **Description**: Get progress data for a specific goal
- **Auth Required**: Yes
- **Path Parameters**:
  - `goalID`: ID of the goal to retrieve progress for
- **Query Parameters**:
  - `date`: Number (Unix timestamp)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of progress objects
    ```json
    [
      {
        "progress_value": 80,
        "status": "Completed",
        "recorded_at": 1709164800,
        "target_value": 100
      }
    ]
    ```
- **Error Responses**:
  - **Code**: 400 BAD REQUEST - Invalid parameters
  - **Code**: 401 UNAUTHORIZED - Authentication required
  - **Code**: 404 NOT FOUND - Invalid goal ID
  - **Code**: 500 INTERNAL SERVER ERROR

## Data Models

### User
- `user_id`: Integer (Primary Key)
- `first_name`: String
- `last_name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `salt`: String
- `session_token`: String
- `last_active`: Date
- `creation_DATE`: Date

### Body Metrics
- `data_id`: Integer (Primary Key)
- `user_id`: Integer (Foreign Key)
- `age`: Integer
- `height`: Decimal
- `last_upDATEd`: Date

### Daily Goals
- `goal_id`: Integer (Primary Key)
- `user_id`: Integer (Foreign Key)
- `goal_type`: String
- `target_value`: Integer
- `recorded_at`: Date

### Daily Progress
- `progress_id`: Integer (Primary Key)
- `goal_id`: Integer (Foreign Key)
- `progress_value`: Integer
- `status`: String
- `recorded_at`: Date

### Weight History
- `weight_id`: Integer (Primary Key)
- `weight`: Decimal
- `recorded_at`: Date
- `user_id`: Integer (Foreign Key)

### Workouts
- `workout_id`: Integer (Primary Key)
- `workout_DATE`: Date
- `type`: String
- `duration`: Integer
- `calories_burned`: Integer
- `intensity`: Integer
- `user_id`: Integer (Foreign Key)

## Notes for Deployment

1. **Hosting**: This API can be hosted on platforms like Render, Heroku, or AWS.
2. **Environment Variables**: 
   - `PORT`: The port on which the server will run (default: 3333)
3. **Database**: The API uses SQLite by default, which may need to be changed for production environments.
4. **API Documentation**: Swagger UI is available at the `/docs` endpoint. 