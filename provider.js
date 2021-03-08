const { Provider } = require('oidc-provider');
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser');
const config = require('./config')

const profileNames = {}

const provider = new Provider(config.issuer, {
    async findAccount(ctx, id) {
      return {
        accountId: id,
        async claims(use, scope) { 
            return { 
                sub: id,
                name: profileNames[id]
              };
          },
      };
    },
    claims: {
      openid: ['sub', 'name'],
    },
    features: {
        devInteractions: {
            enabled: false
        },
    },

    clients: [{
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uris: config.redirectUris,
    }],
});
const router = new Router()

// allow X-Forwarded-Proto and X-Forwarded-For to be set
provider.proxy = true

router.get('/interaction/:grant', async (ctx, next) => {
    ctx.body = `
<form method="post" action="/interaction/${ctx.params.grant}">
Mit welchen Namen möchtest du dich einloggen?<br />
<input type="text" name="username" placeholder="Name..." required />

<input type="submit" value="Weiter">
</form>`
});


router.post('/interaction/:grant', async (ctx, next) => {
    const profileName = ctx.request.body.username
    const id = config.generateId(profileName)
    profileNames[id] = profileName
    await provider.interactionFinished(ctx.req, ctx.res, {
        login: { 
            account: id,
            remember: false
        },
        consent: {} 
      }, { mergeWithLastSubmission: true });  
});


provider.use(bodyParser());
provider.use(router.routes());

const server = provider.listen(config.listenPort, '0.0.0.0', () => {
  console.log('oidc-provider listening on port 1234, check http://192.168.100.163:1234/.well-known/openid-configuration');
});
