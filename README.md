# Major P1

A full-stack web application for managing travel listings, built with Node.js, Express, and MongoDB. Users can create, view, edit, and review listings, with authentication and image uploads.

## Features

- User authentication and authorization
- Create, read, update, delete listings
- Image uploads via Cloudinary
- Review system for listings
- Flash messages for user feedback
- Responsive UI with EJS templates
- Session management with MongoDB store
- Input validation with Joi
- Map integration with MapTiler

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (local or Atlas)
- **Authentication**: Passport.js with Local Strategy
- **Templating**: EJS with EJS-Mate
- **Image Storage**: Cloudinary
- **Validation**: Joi
- **Session Store**: connect-mongo
- **Maps**: MapTiler SDK

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pushkar0504/Major-P1.git
   cd Major-P1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   NODE_ENV=development
   ATLASDB_URL=mongodb://127.0.0.1:27017/Wanderlust
   SECRET=your_secret_key_here
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   MAPTILER_API_KEY=your_maptiler_api_key
   ```

   For production, set `NODE_ENV=production` and use your MongoDB Atlas URL.

4. Start MongoDB (if using local):
   ```bash
   mongod
   ```

5. (Optional) Initialize sample data:
   ```bash
   node init/index.js
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   # or for development
   nodemon app.js
   ```

2. Open your browser and go to `http://localhost:8080`

## Scripts

- `npm start`: Start the production server
- `node init/index.js`: Initialize database with sample data

## Project Structure

```
Major-P1/
├── app.js                 # Main application file
├── cloudconfig.js         # Cloudinary configuration
├── middleware.js          # Custom middleware
├── schema.js              # Joi validation schemas
├── init/
│   ├── index.js           # Database initialization
│   └── data.js            # Sample data
├── models/
│   ├── listing.js         # Listing model
│   ├── review.js          # Review model
│   └── user.js            # User model
├── controllers/
│   ├── listing.js         # Listing routes logic
│   ├── review.js          # Review routes logic
│   └── users.js           # User routes logic
├── routes/
│   ├── listing.js         # Listing routes
│   └── review.js          # Review routes
├── views/                 # EJS templates
├── public/                # Static assets
├── utils/                 # Utility functions
└── classroom/             # Additional classroom content
```

## Environment Variables

- `NODE_ENV`: Environment (development/production)
- `ATLASDB_URL`: MongoDB connection URL
- `SECRET`: Session secret key
- `CLOUD_NAME`: Cloudinary cloud name
- `CLOUD_API_KEY`: Cloudinary API key
- `CLOUD_API_SECRET`: Cloudinary API secret
- `MAPTILER_API_KEY`: MapTiler API key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.