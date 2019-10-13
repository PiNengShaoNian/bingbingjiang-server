const Router = require('koa-router')
const fs = require('fs')
const dishRouter = new Router()

const multer = require('koa-multer');
const path = require('path');
const DishModel = require('../db/dish')

let dishImages = []

const validateImage = (imgUid) => {
    const lastImg = dishImages[dishImages.length - 1]
    if (!lastImg) return true
    if (lastImg.split('-')[0] === imgUid.split('-')[0]) return true
    else return false
}
const noop = () => { }
const deleteFiles = (arr) => {
    arr.forEach(v => {
        fs.unlink(path.join(process.cwd(), 'upload', v), noop)
    })
}
const storage = multer.diskStorage({
    destination: path.join(process.cwd(), "upload"),
    filename(req, file, cb) {
        const filenameArr = file.originalname.split('.');
        const { currentUploadFileUid } = req.body
        const fileName = currentUploadFileUid + '.' + filenameArr[filenameArr.length - 1]
        if (!validateImage(currentUploadFileUid)) {
            deleteFiles(dishImages)
            dishImages = []
        }
        dishImages.push(fileName)
        cb(
            null,
            currentUploadFileUid
            + '.'
            + filenameArr[filenameArr.length - 1]
        )
    }
});

const upload = multer({ storage });

dishRouter.post(
    '/upload/image',
    upload.single('file'),
    async (ctx) => {
        ctx.body = {}
    }
)

dishRouter.post(
    '/upload/dish',
    async (ctx) => {
        const { price, name, desc, timestamp, category } = ctx.request.body
        if (!timestamp) {
            ctx.body = {
                code: -1,
                msg: 'timestamp cannot be null'
            }
            return
        }

        const newDish = await new DishModel({
            name,
            price,
            desc,
            imgUrls: dishImages,
            category
        }).save()
        if (newDish) {
            dishImages = []
            ctx.body = {
                code: 0
            }
        }
        else {
            ctx.body = {
                code: -1,
                msg: '添加失败'
            }
        }
    }
)

dishRouter.get('/upload/remove', async (ctx) => {
    const { fileUid, fileExtension } = ctx.request.query

    if (!fileUid) {
        ctx.body = {
            code: -1,
            msg: '请上传要删除的文件'
        }
        return
    }

    const filePath = path.join(process.cwd(), 'upload', fileUid + fileExtension)

    if (fs.existsSync(path.join(process.cwd(), 'upload', fileUid + fileExtension))) {
        fs.unlink(filePath, (err) => {
            if (err) {
                ctx.body = {
                    code: -1,
                    msg: err
                }
                return
            }
            dishImages = dishImages.filter((v) => v !== fileUid + fileExtension)
            ctx.body = {
                code: 0
            }
        })
    }

    ctx.body = {
        code: 0
    }
})

dishRouter.get('/list', async (ctx) => {
    const dishes = await DishModel.find()
    if (dishes) {
        ctx.body = {
            code: 0,
            data: {
                list: dishes
            }
        }
    }
    else {
        ctx.body = {
            code: -1,
            msg: 'dishes获取失败'
        }
    }
})

dishRouter.post('/deleteone', async (ctx) => {
    const { name, category, imgUrls } = ctx.request.body

    if (!name && !category) {
        ctx.body = {
            code: -1,
            msg: 'required params cannot be null'
        }
    }

    if (imgUrls && imgUrls.length) {
        deleteFiles(imgUrls)
    }
    const result = await DishModel.deleteOne({ name: name, category: category })

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
                    name,
                    category
                }
            }
        }
    }
})

dishRouter.post('/update', async (ctx) => {
    const {
        name,
        category,
        imgUrls,
        desertedImages,
        price,
        desc,
        _id
    } = ctx.request.body


    if (!_id) {
        ctx.body = {
            code: -1,
            msg: 'id cannot be null'
        }
        return
    }

    if (desertedImages) {
        deleteFiles(desertedImages)
    }

    console.log({
        name,
        category,
        imgUrls,
        desertedImages,
        price,
        desc,
        _id
    })

    const result = await DishModel.findByIdAndUpdate(_id, {
        name,
        category,
        imgUrls,
        price,
        desc
    })

    ctx.body = {
        code: 0,
        data: {
            result
        }
    }
})

module.exports = dishRouter