import { v4 as uuidv4 } from 'uuid'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import Application from '@ioc:Adonis/Core/Application'
export default class MomentsController {
    private validationOptions = {
        types: ['image'],
        size: '2mb'
    }
    public async store({ request, response }: HttpContextContract) {
        const body = request.body();

        const image = request.file('image', this.validationOptions)
        if (image) {
            const imageName = `${uuidv4()}.${image.extname}`
            await image.move(Application.tmpPath("uploads"), {
                name: imageName,

            })
            body.image = imageName;
        }

        const moment = await Moment.create(body);
        console.log(moment)
        response.status(201);
        return { moment, msg: "momento criado com sucesso" }
    }
    public async index() {
        const moments = await Moment.query().preload("comments");
        return { data: moments }
    }
    public async show({ params }: HttpContextContract) {
        const moment = (await Moment.findOrFail(params.id))
        await moment.load("comments");
        return { data: moment, }
    }
    public async destroy({ params }: HttpContextContract) {
        const moment = (await Moment.findOrFail(params.id)).delete();
        return {
            data: moment,
            msg: "Deletado com sucesso!",
        }
    }
    public async update({ params, request }: HttpContextContract) {
        const moment = (await Moment.findOrFail(params.id));
        const body = request.body();
        const image = request.file('image', this.validationOptions)
        if (image) {
            const imageName = `${uuidv4()}.${image.extname}`
            await image.move(Application.tmpPath("uploads"), {
                name: imageName,

            })
            moment.image = imageName;
        }

        moment.title = body.title;
        moment.description = body.description;

        await moment.save();
        return {
            data: moment,
            msg: "Momento atualizado!",
        }
    }
}
