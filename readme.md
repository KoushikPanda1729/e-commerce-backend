# E-Commerce Backend Project

This project is a backend service for an e-commerce application. It utilizes a variety of technologies to handle user authentication, product management, image uploads, and data handling. Below is an overview of the technologies and their usage in the project.

## Technologies Used

- **bcrypt**: Used for hashing and verifying user passwords.
- **Cloudinary**: Handles image uploads and storage.
- **cookie-parser**: Parses cookies attached to client requests.
- **cors**: Enables Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend.
- **dotenv**: Loads environment variables from a `.env` file.
- **Express**: A web application framework for Node.js, used to build the server.
- **jsonwebtoken**: Used for creating and verifying JSON Web Tokens (JWTs) for authentication.
- **mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **mongoose-aggregate-paginate-v2**: Provides pagination for Mongoose aggregate queries.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node Package Manager is installed with Node.js. Verify by running `npm -v` in your terminal.
- **MongoDB**: Install MongoDB from [mongodb.com](https://www.mongodb.com/). Ensure MongoDB is running on your local machine or provide a remote MongoDB URI.
- **Cloudinary Account**: Sign up for a free account at [Cloudinary](https://cloudinary.com/). You will need your Cloud Name, API Key, and API Secret.
- **Environment Variables**: Set up a `.env` file in the root directory of your project with the following variables:

  ```env
  PORT=8000
  MONGODB_URI=your_mongodb_uri
  CORS_ORIGIN=*
  ACCESS_TOKEN_SECRET=youraccesstokensecret
  ACCESS_TOKEN_EXPIRY=youraccesstokenexpiry
  REFRESH_TOKEN_SECRET=yourrefreshtokensecret
  REFRESH_TOKEN_EXPIRY=yourrefreshtokenexpiry

  CLOUDINARY_CLOUD_NAME=yourcloudname
  CLOUDINARY_API_KEY=yourapikey
  CLOUDINARY_API_SECRET=yourapisecret

  EMAIL_USER=Use your own email
  EMAIL_PASSWORD=Use your own password


  For payments use braintree

  BRAINTREE_MARCHENT_ID=use your id
  BRAINTREE_PUBLIC_KEY=use your id
  BRAINTREE_PRIVATE_KEY=use your id

  ```
