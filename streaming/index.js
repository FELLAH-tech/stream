import koa from 'koa'
import {extname} from 'path'

const app = new koa()

app.use(({request,response}, next)=>{
    if (
        !request.url.startsWith('/api/video')||
        !request.query.video ||
        !request.query.video.match(/^[a-z0-9-_]+\.(mp4|mov)$/i)
    ){
        return next()
    }
    const video = request.query.video
    response.type = extname(video)
    response.body = 'gjhvgkjh'
})



app.listen(3000)