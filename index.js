const Koa = require('koa')
const koaBodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const router = require('./router')
const app = new Koa()


app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});

app.use(serve('./admin-build'))
app.use(serve('./upload'))

app.use(koaBodyParser())

app.use(router.routes()).use(router.allowedMethods())

app.listen(3001, () => {
    console.log('server is running on 3001 port')
});
