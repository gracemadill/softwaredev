const { getDefaultConfig } = require("expo/metro-config");
module.exports = (projectRoot) => {
  const config = getDefaultConfig(projectRoot);
  config.resolver.sourceExts.push("cjs");
  return config;
};
