const Router = require('koa-router')
const OrderModel = require('../db/order')

const orderRouter = new Router()

orderRouter.post('/submit', async (ctx) => {
    const { order } = ctx.request.body
    if (!order) {
        ctx.body = {
            code: -1,
            msg: 'required params order cannot be null'
        }
        return
    }

    const dishNames = Object.keys(order)
    const dishes = []
    dishNames.forEach(dishName => {
        const dish = order[dishName]
        dish.category = dish.category.title
        dishes.push(dish)
    })

    let sum = 0
    let count = 0

    dishNames.forEach(v => {
        sum += order[v].price * order[v].count
        count += order[v].count
    })

    const result = await new OrderModel({
        date: Date.now(),
        dishes,
        sum,
        status: 0,
        count: count
    }).save()

    if (result.date) {
        ctx.body = {
            code: 0,
            data: {
                result
            }
        }
    }
    else {
        ctx.body = {
            code: -1,
            msg: 'order submit failed'
        }
    }
})

orderRouter.get('/confirm', async (ctx) => {
    const { id } = ctx.request.query

    if(!id) {
        ctx.body = {
            code: -1,
            msg: 'required params id cannot be null'
        }
        return
    }

    const result = await OrderModel.findByIdAndUpdate(id, {
        status: 1
    })

    if('status' in result) {
        ctx.body = {
            code: 0,
            data: {
                result
            }
        }
    }
    else {
        ctx.body = {
            code: -1,
            msg: '确认失败'
        }
    }
})

orderRouter.get('/list', async (ctx) => {
    const { query } = ctx.request
    const result = await OrderModel.find(query)

    if(Array.isArray(result)) {
        ctx.body = {
            code: 0,
            data: {
                list: result
            }
        }
    }
    else {
        ctx.body = {
            code: -1,
            msg: '查询失败'
        }
    }
})

orderRouter.get('/check', async (ctx) => {
    const { id } = ctx.request.query
    if(!id) {
        ctx.body = {
            code: -1,
            msg: 'required params id cannot be null'
        }
        return
    }

    const result = await OrderModel.findById(id)

    if('status' in result) {
        ctx.body = {
            code: 0,
            data: {
                result
            }
        }
     return
    }
    ctx.body = {
        code: 0,
        data: {
            result: {}
        }
    }
})

module.exports = orderRouter