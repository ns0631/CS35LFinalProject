# UCLA Rideshare App

A mobile application that helps UCLA students coordinate and share rides.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/client) app on your mobile device
- [MongoDB](https://www.mongodb.com/try/download/community) (for the backend database)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CS35LFinalProject
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=your_jwt_secret_here
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Start the frontend development server:
```bash
npx expo start
```

## Running the App

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npx expo start
```

3. Open the Expo Go app on your mobile device:
   - Make sure your phone and computer are on the same WiFi network
   - Scan the QR code shown in the terminal
   - The app should load on your device

## Troubleshooting

### Connection Issues
- Ensure your phone and computer are on the same WiFi network
- Check if your computer's firewall is allowing connections on port 8000
- The app automatically detects your computer's IP address, but if you're having issues:
  1. Find your computer's local IP address:
     - On macOS/Linux: `ifconfig` or `ip addr`
     - On Windows: `ipconfig`
  2. Update the backend URL in `frontend/config.js` if needed

### Common Errors
- If MongoDB fails to connect, ensure the MongoDB service is running
- If you see "Network request failed", check your WiFi connection and backend server status
- For login timeouts, ensure your backend server is running and accessible

## Development Notes

- The backend runs on port 8000
- The frontend uses Expo for development and testing
- MongoDB should be running locally on the default port (27017)
- All API endpoints are prefixed with `/api`

## Required Dependencies

### Backend Dependencies
```json
{
  "bcrypt": "^5.0.1",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "express": "^4.17.3",
  "jsonwebtoken": "^8.5.1",
  "mongoose": "^6.2.4",
  "nodemailer": "^6.7.2"
}
```

### Frontend Dependencies
```json
{
  "@react-navigation/native": "^6.0.8",
  "@react-navigation/native-stack": "^6.5.0",
  "expo": "~48.0.0",
  "expo-status-bar": "~1.4.4",
  "react": "18.2.0",
  "react-native": "0.71.8",
  "react-native-safe-area-context": "4.5.0",
  "react-native-screens": "~3.20.0",
  "@react-native-async-storage/async-storage": "1.17.11"
}
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
