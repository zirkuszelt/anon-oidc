module.exports = {
    issuer: 'https://anon-oidc.example.com/',
    listenPort: 1234,
    clientId: 'foo',
    clientSecret: 'bar',
    redirectUris: [
        'https://matrix.example.com/_synapse/oidc/callback',
        'https://matrix.example.com/_synapse/client/oidc/callback'
    ],
    
    generateId: (profileName) =>  "anonym_"+(Math.random().toString(16).slice(2))
}