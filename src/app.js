const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')
const koaTwig = require('koa-twig');
const config = require('../config')
const providerGenerator = require('./provider')

const profileNames = {}
const provider = providerGenerator(profileNames)

const render = koaTwig({
  views: `${__dirname}/views`,
})

// route definitions
router.get('/interaction/:grant', add)
router.post('/interaction/:grant', create)
router.get('/health', health)

async function add(ctx) {
  await ctx.render('new', { grant: ctx.params.grant });
}

async function create(ctx) {
  const profileName = ctx.request.body.username
  const id = config.generateId(profileName)
  profileNames[id] = profileName
  await provider.interactionFinished(
    ctx.req,
    ctx.res,
    {
      login: {
        account: id,
        remember: false,
      },
      consent: {},
    },
    { mergeWithLastSubmission: true },
  )
}
async function health(ctx) {
  ctx.body = { success: true }
}

provider.use(render);
provider.use(bodyParser())
provider.use(router.routes())

const server = provider.listen(config.listenPort, '0.0.0.0', () => {
  console.log(
    `oidc-provider listening on port ${config.listenPort}, check http://127.0.0.1:${config.listenPort}/.well-known/openid-configuration`,
  )
})
