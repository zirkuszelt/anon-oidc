module.exports = {
  issuer: process.env.HOSTNAME,
  listenPort: 8080,
  clientId: process.env.BROKER_CLIENT_ID,
  clientSecret: process.env.BROKER_CLIENT_SECRET,
  redirectUris: [
    process.env.BROKER_REDIRECT_URI
  ],

  generateId: (profileName) => 'guest_' + Math.random().toString(16).slice(2),
}
