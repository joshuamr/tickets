module.exports = {
  webpack: (config) => {
	// pulls files every 300 ms
    config.watchOptions.poll = 300;
    return config;
  },
};