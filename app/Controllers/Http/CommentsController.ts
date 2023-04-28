import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {
    public async store({params, request, response}:HttpContextContract){
        const body = request.body()
        console.log(body)
        const momentId = params.momentId
        await Moment.findOrFail(momentId)
        body.momentId = momentId
        const comment = await Comment.create(body)
        response.status(201)
        return{
            msg: "Comentario adicionado",
            data: comment
        }
    }
}