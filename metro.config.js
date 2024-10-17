// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, "tflite"], // Add tflite as a recognized asset extension
  },
};
