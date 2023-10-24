import { Response, Request } from 'express';
import qrcode from 'qrcode'
import './instance';

export class WhatsappController {

    static async getQR(req: Request, res: Response): Promise<any> {
        try {
            if(!!globalThis.instance.getQR()){
                const qrBuffer = await qrcode.toBuffer(globalThis.instance.getQR())
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': qrBuffer.length
                });
                res.end(qrBuffer);
            } else {
                res.status(500).json({
                    message: 'QR is not ready'
                })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

    static async getContact(req: Request, res: Response): Promise<any> {
        try {
            if(!!globalThis.instance){
                const contacts = await globalThis.instance.getContacts()
                res.status(200).json({ status: 200, data: contacts })
            } else {
                res.status(500).json({
                    message: 'Instance is not ready'
                })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

    static async getStatus(req: Request, res: Response): Promise<any> {
        try {
            if(!!globalThis.instance){
                res.status(200).json({ status: 200, data: await globalThis.instance.getAuth() })
            } else {
                res.status(500).json({
                    message: 'Instance is not ready'
                })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

    static async getChats(req: Request, res: Response): Promise<any> {
        try {
            if(!!globalThis.instance){
                const chatId = req.params.id
                const chats = await globalThis.instance.getChats(chatId)
                res.status(200).json({ status: 200, data: chats })
            } else {
                res.status(500).json({
                    message: 'Instance is not ready'
                })
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

}

export default WhatsappController