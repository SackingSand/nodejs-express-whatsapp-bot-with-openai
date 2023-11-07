import { Router } from 'express';
import WhatsappController from '../../../controller/whatsapp';

const router = Router()

router.get("/qr", WhatsappController.getQR);
router.get("/contact", WhatsappController.getContact);
router.get("/status", WhatsappController.getStatus);
router.get("/chats/:id", WhatsappController.getChats);
router.get("/info/liveshare", WhatsappController.sendSingleMessage)

export default router;