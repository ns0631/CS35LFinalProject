import Constants from 'expo-constants';

const getApiUrl = () => {
  // If you are running in Expo Go, this will get your computer's IP automatically
  // and build the backend URL. This works for most Expo setups.
  const { manifest } = Constants;
  let ip = 'localhost'; // fallback

  if (manifest && manifest.debuggerHost) {
    ip = manifest.debuggerHost.split(':').shift();
  }

  return `http://${ip}:8000/api`;
};

export const API_URL = getApiUrl(); 