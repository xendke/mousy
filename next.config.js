module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    // used for default avatar. TODO: find new 1 and self host
    domains: ['encrypted-tbn0.gstatic.com', 'firebasestorage.googleapis.com'],
  },
}
