const Router = require('koa-router')
const loginRouter = require('./login')
const dishRouter = require('./dish')
const categoryRouter = require('./category')
const orderRouter = require('./order')

const router = new Router()

router.use('/login', loginRouter.routes(), loginRouter.allowedMethods())
router.use('/dish', dishRouter.routes(), loginRouter.allowedMethods())
router.use('/category', categoryRouter.routes(), categoryRouter.allowedMethods())
router.use('/order', orderRouter.routes(), orderRouter.allowedMethods())

module.exports = router