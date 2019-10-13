const Router = require('koa-router')
const categoryModel = require('../db/category')

const categoryRouter = new Router

categoryRouter.get('/list', async (ctx) => {
    const categories = await categoryModel.find()
    ctx.body = {
        code: 0,
        data: {
            list: categories
        }
    }
})

categoryRouter.get('/delete', async (ctx) => {
    const { title } = ctx.request.query

    const result = await categoryModel.deleteOne({ title: title })

    if (result.deletedCount > 0) {
        ctx.body = {
            code: 0
        }
    }
    else {
        ctx.body = {
            code: -1,
            msg: {
                result,
                params: {
                    title
                }
            }
        }
    }
})

categoryRouter.get('/add', async (ctx) => {
    const { title } = ctx.request.query

    if(!title) {
        ctx.body = {
            code: -1,
            msg: 'required params title cannot be null'
        }
        return
    }

    const result = await new categoryModel({
        title
    }).save()
    console.log(result)
    if(result.title) {
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
            msg: result
        }
    }

})

module.exports = categoryRouter