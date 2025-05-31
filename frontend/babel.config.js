module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env.local',       // you can keep .env.local
        safe: false,              // ← turn off “safe” mode
        allowUndefined: false,    // ← error if you typo your var
        whitelist: ['GOOGLE_MAPS_API_KEY'],  // ← explicitly allow this key
      }]
    ]
  };
};