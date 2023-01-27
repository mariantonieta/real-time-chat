import { query } from 'express'
import message from '../models/message.js'
import Message from '../models/message.js'
var controller = {
    save: (req, res) => {
        const params = req.body
        const message = new Message()
        message.message = params.message
        message.from = params.from
        message.save((error, messageStore) =>{
            if(error || !messageStore)
            {
                return res.status(404).send({
                    status: 'error',
                    message: 'No ha sido posible enviar el mensaje'
                })
            }
            return res.status(200).send({
                status: 'Success',
                messageStore
            })
        })
    },
    getMessage: (req, res) =>{
        const query = Message.find({})
            query.sort('-_id').exec((error, messages)=>{
                if(error)
                {
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error al extraer los datos'
                    })
                }
                if(!messages){
                    return res.status(404).send<({
                        status: 'Error',
                        message: 'No hay mensajes q mostrar'
                    })
                }
                return res.status(200).send({
                    status: 'Success',
                    messages
                })
            })


    } 
}
export default controller;