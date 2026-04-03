import Koa from 'koa'
import KoaRouter from 'koa-router'
import bodyParser from 'koa-bodyparser'
import mockList from './mock/index.js'
import loginInterceptor from './interceptor/loginInterceptor.js'

const app = new Koa()
const router = new KoaRouter()
app.use(bodyParser())
router.get('/', async ctx => {
  ctx.body = 'mock server'
})

app.use(loginInterceptor)

const getRes = async fn => {
  return new Promise((resolve, reject) => {
    resolve(fn())
  })
}

mockList.forEach(item => {
  router[item.method](item.url, async ctx => {
    ctx.body = await getRes(item.response.bind(null, ctx))
  })
})

app.use(router.routes())

app.listen(5001, () => {
  console.log('mock server start at http://localhost:5001')
})
