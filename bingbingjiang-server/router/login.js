const Router = require('koa-router')
const bcrypt = require('bcrypt')
const UserModel = require('../db/user')

const loginRouter = new Router()

loginRouter.post('/', async (ctx) => {
    const {user, password} = ctx.request.body

    const users = await UserModel.find({name: user})
    if(users.length < 1) {
        ctx.body = {
            code: -1,
            msg: '用户不存在'
        }
        return
    }
    const isEqual = await bcrypt.compare(password, users[0].password)
    if(isEqual) {
        ctx.body = {
            code: 0,
            data: {
                user: users[0]
            }
        }
    }
    else {
        ctx.body = {
            code: -1,
            msg: '密码错误'
        }
    }
})

module.exports = loginRouter