const router = require('@koa/router')()
const bodyParser = require('koa-bodyparser')
const koaTwig = require('koa-twig');

const config = require('../config')
const providerGenerator = require('./provider')

const provider = providerGenerator()

const render = koaTwig({
  views: `${__dirname}/views`,
})

router.get('/interaction/:grant', async (ctx) => {
  await ctx.render('new', { grant: ctx.params.grant, recaptchaSiteKey: config.recaptcha.siteKey })
})

router.post('/interaction/:grant', async (ctx) => {
  try {
    const response_key = ctx.request.body["g-recaptcha-response"]
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secretKey}&response=${response_key}`

    const res = await fetch(url, { method: "post" })
    const captchaResponse = await res.json();
    if (!captchaResponse.success) {
      ctx.status = 403
      ctx.body = "Captcha failed"
      return
    }

    const id = config.generateId()
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
  } catch (e) {
    console.error(e);
    throw e;
  }
})

router.get('/health', (ctx) => {
  ctx.body = { success: true}
})

provider.use(render);
provider.use(bodyParser())
provider.use(router.routes())

const server = provider.listen(config.listenPort, '0.0.0.0', () => {
  console.log(
    `oidc-provider listening on port ${config.listenPort}, check http://127.0.0.1:${config.listenPort}/.well-known/openid-configuration`,
  )
})
