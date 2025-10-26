require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    unrealSpeechApiKey: process.env.UNREAL_SPEECH_API_KEY || '',
  },
});
