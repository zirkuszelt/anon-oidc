module.exports = {
  issuer: process.env.ISSUER,
  listenPort: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  clientId: process.env.BROKER_CLIENT_ID,
  clientSecret: process.env.BROKER_CLIENT_SECRET,
  redirectUris: [
    process.env.BROKER_REDIRECT_URI
  ],
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    secretKey: process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe",
  },
  generateId: () => 'guest_' + Math.random().toString(16).slice(2),
}
